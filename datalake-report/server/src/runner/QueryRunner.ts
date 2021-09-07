import { Loggers } from './../Logger';
import { HiveQueries, HiveRunRuleParameters } from './../HiveQueries';
import { Config } from './../Config';
import { RunHistoryHelper } from './RunHistoryHelper';
import * as requestPromise from 'request-promise';
import * as cron from 'node-cron';
import { Logger } from 'log4js';

/** 
 * 1. Cron job to check for pending jobs
 * 2. When job is picked
 *  -> Update MySQL with status as running
 *  -> Call Service to run job (Hive query)
 *  -> On Fail : Update MySQL with fail status
 *  -> On Complete
 *      -> Mark job for fetch
 *      -> Get count from hive and update to MySQL
 *      -> If result count is more thatn 0
 *      -> Download result and save on file system
 *      -> Update MySQL with status as Completed
 *      -> If count is 0
 *      -> Mark as Completed and disable download
*/
export class QueryRunner {
    public io: any;
    public cronTaskToCheckForPendingJobs: any;
    public cronStop: boolean;
    public totalrunningrules: number;


    constructor(io: any) {
        this.io = io;
        this.init();
        this.cronStop = false;
        this.totalrunningrules = 0;
    }

    public init() {
        let self = this;
        //Loggers.cronQueryServiceLog.info("Date time inside init method "+new Date());//Added by Subrata 30122020
        //Loggers.cronQueryServiceLog.info("Config.CRON_JOB.TIMER "+Config.CRON_JOB.TIMER);
        this.cronTaskToCheckForPendingJobs = cron.schedule(Config.CRON_JOB.TIMER, function () {
            self.checkRunningJobs();
        }, false);

        this.cronTaskToCheckForPendingJobs.start();
    }

    public updateRunningJobs() {
        let self = this;
        Loggers.cronCachedFileExpirationCheck.info("updateRunningJobs");
        RunHistoryHelper.updateRunningStatus().then(response => {
            Loggers.cronQueryServiceLog.info(`Triggered Query : ${JSON.stringify(response)}`);
        }).catch(error => {
            Loggers.cronQueryServiceLog.info('No Running items');
        });
    }


    public checkRunningJobs() {
        Loggers.cronQueryServiceLog.info("checkRunningJobs()====== "+new Date());
        let self = this;
        RunHistoryHelper.getRunning().then(response => {
            //Loggers.cronQueryServiceLog.info(`Triggered query for running : ${JSON.stringify(response)}`);
            self.totalrunningrules = response.noofrunningrules;
           //Chinmay 02-Jan-2021 self.checkPendingJobs();
            //Loggers.cronQueryServiceLog.info(`Total running rules: ${self.totalrunningrules}}`);
        }).catch(error => {
            //Loggers.cronQueryServiceLog.info(`No running items`);
            self.totalrunningrules = 0;
            //Chinmay 02-Jan-2021 self.checkPendingJobs();
        });
        self.checkPendingJobs();
    }

    public checkPendingJobs() {
        let self = this;
        Loggers.cronQueryServiceLog.info("checkPendingJobs()====================");
        Loggers.cronQueryServiceLog.info("checkPendingJobs totalrunningrules "+this.totalrunningrules+ " Config.RUNNING_LIMIT " +Config.RUNNING_LIMIT)
        if (this.totalrunningrules >= Config.RUNNING_LIMIT) {
            //Chinmay 02-Jan-2021 this.cronStop = true;
            //Chinmay 02-Jan-2021 self.cronTaskToCheckForPendingJobs.stop();
            return;
        } else {
            //Loggers.serviceGtddlLog.info(" checkPendingJobs 81 cronStop"+this.cronStop);
            /*Chinmay  02-Jan-2021
            if (this.cronStop == true) {
                self.cronTaskToCheckForPendingJobs.start();
                this.cronStop = false;
            }
            Chinmay 02-Jan-2021*/
        }
        RunHistoryHelper.getPending().then(response => {
            Loggers.cronQueryServiceLog.info("getPending() Response : " + JSON.stringify(response));
            //Loggers.cronQueryServiceLog.info(`Totalrunningrules:  ${JSON.stringify(response)}`);
            // self.cronTaskToCheckForPendingJobs.stop();
            self.triggerQuery(response);
        }).catch(err => {
            Loggers.cronQueryServiceLog.info("No pending items");
            // self.cronTaskToCheckForPendingJobs.start();
        });
    }

    /**
     * To be triggered from cron job
     * @param data 
     */
    public triggerQuery(data: HiveRunRuleParameters) {
        Loggers.cronQueryServiceLog.info("triggerQuery()====");

        let self = this;

        //Loggers.serviceGtddlLog.info("UpdateTo 1"); //Subrata
        RunHistoryHelper.updateTo(data.RuleRunID, data.RuleExecutedByUser, 'RUNNING', self.io, "null");
        let finalQuery = HiveQueries.runRuleQuery(data);

        //Loggers.serviceGtddlLog.info("QUERY : " + finalQuery);

        var options = {
            method: 'POST',
            uri: `${Config.REST_END_POINT.BASE_PATH}${Config.REST_END_POINT.QUERY_END_POINT}`,
            headers: {
                'Authorization': Config.REST_END_POINT.AUTH,
                'Content-Type': 'application/json',
                'Accept': 'text/plain'
            },
            body: {
                query: finalQuery
            },
            json: true
        };

        this.updateHivePartitionMode().then((response) => {

            Loggers.serviceGtddlLog.warn("Hive Partition info update resolved");
            //Loggers.cronQueryServiceLog.info(" updateHivePartitionMode 1");
            requestPromise(options)
                .then((response) => {
                    Loggers.cronQueryServiceLog.info(`Success=>> RuleRunID[${data.RuleRunID}]`);

                    Loggers.serviceGtddlLog.info(`Success running Query`);
                    Loggers.cronQueryServiceLog.info(`Run Success for RuleRunID[${data.RuleRunID}]`);
                    //Loggers.cronQueryServiceLog.info(" updateHivePartitionMode 1.1");
                    this.getRunResultCountFromHive(data);

                })
                .catch((err) => {
                    Loggers.cronQueryServiceLog.info(`Catch Failure=>> RuleRunID[${data.RuleRunID}]`);
                    Loggers.serviceGtddlLog.error(`Failure running Query ERROR[${err}]`);
                    Loggers.cronQueryServiceLog.error(`Run failed for RuleRunID[${data.RuleRunID}]`);

                    Loggers.serviceGtddlLog.info("UpdateTo 2");
                    RunHistoryHelper.updateTo(data.RuleRunID, data.RuleExecutedByUser, 'FAILED', self.io, "null", 'Error running hive query');
                    //Chinmay 02-Jan-2021 self.checkRunningJobs();
                });
        }, error => {
            Loggers.cronQueryServiceLog.info(`Error Failure=>> RuleRunID[${data.RuleRunID}]`);
            Loggers.serviceGtddlLog.error(`Failure updating Hive Partition info ERROR[${error}]`);
            Loggers.cronQueryServiceLog.error(`Run failed for RuleRunID[${data.RuleRunID}]`);
            Loggers.serviceGtddlLog.info("UpdateTo 3");
            RunHistoryHelper.updateTo(data.RuleRunID, data.RuleExecutedByUser, 'FAILED', self.io, "null", 'Error running hive query');
            //Chinmay 02-Jan-2021  self.checkRunningJobs();
        });

    }

    getRunResultCountFromHive(data: HiveRunRuleParameters) {
        Loggers.cronQueryServiceLog.info('getRunResultCountFromHive 2');
        let self = this;
        let options = {
            method: 'GET',
            uri: `${Config.REST_END_POINT.BASE_PATH}${Config.REST_END_POINT.SELECT_QUERY_END_POINT}?query=${HiveQueries.getQueryForRunResultCountFromHive(data)}`,
            headers: {
                'Authorization': Config.REST_END_POINT.AUTH1
            },
            json: true
        };

        Loggers.serviceGtddlLog.info(`Get run result count QUERY[${options.uri}]`);
        //Loggers.serviceGtddlLog.info('2');
        //Loggers.cronQueryServiceLog.info('getRunResultCountFromHive 2.2');

        requestPromise(options)
            .then((response) => {
                //Loggers.serviceGtddlLog.info("Response Rows Length "+response.rows.length);
                if (response && response.rows && response.rows.length > 0 && response.rows[0]) {
                    Loggers.serviceGtddlLog.info("UpdateTo 4");
                    RunHistoryHelper.updateTo(data.RuleRunID, data.RuleExecutedByUser, 'COMPLETED', self.io, response.rows[0].total, "Get Count Success");
                    Loggers.serviceGtddlLog.info(`Get run result count TOTAL[${response.rows[0].total}]`);

                } else {
                    Loggers.serviceGtddlLog.info("UpdateTo 5");
                    RunHistoryHelper.updateTo(data.RuleRunID, 'FAILED', self.io, "0", "Get count failed");
                    Loggers.serviceGtddlLog.error(`Get run result count RESPONSE[${JSON.stringify(response)}]`);
                }
                //Chinmay 02-Jan-2021 self.checkRunningJobs();
            })
            .catch((err) => {
                Loggers.serviceGtddlLog.info("UpdateTo 6");
                RunHistoryHelper.updateTo(data.RuleRunID, data.RuleExecutedByUser, 'FAILED', self.io, "null", 'Get count threw errror');
                Loggers.serviceGtddlLog.error(`Get run result count ERROR[${err}]`);
                //Chinmay 02-Jan-2021 self.checkRunningJobs();
            });
    }

    updateHivePartitionMode(): Promise<any> {
        /*
        let options = {
            method: 'POST',
            uri: `${Config.REST_END_POINT.BASE_PATH}${Config.REST_END_POINT.QUERY_END_POINT}`,
            headers: {
                'Authorization': Config.REST_END_POINT.AUTH,
                'Content-Type': 'application/json',
                'Accept': 'text/plain'
            },
            body: {
                query: HiveQueries.getHivePartitionQuery()
            },
            json: true
        };
        */
        // TODO Only required of hive failes (this is happening on service) return requestPromise(options);
        return Promise.resolve(true);
    }
}