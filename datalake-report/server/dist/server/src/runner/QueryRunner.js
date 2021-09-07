"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./../Logger");
const HiveQueries_1 = require("./../HiveQueries");
const Config_1 = require("./../Config");
const RunHistoryHelper_1 = require("./RunHistoryHelper");
const requestPromise = require("request-promise");
const cron = require("node-cron");
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
class QueryRunner {
    constructor(io) {
        this.io = io;
        this.init();
        this.cronStop = false;
        this.totalrunningrules = 0;
    }
    init() {
        let self = this;
        this.cronTaskToCheckForPendingJobs = cron.schedule(Config_1.Config.CRON_JOB.TIMER, function () {
            self.checkRunningJobs();
        }, false);
        this.cronTaskToCheckForPendingJobs.start();
    }
    updateRunningJobs() {
        let self = this;
        Logger_1.Loggers.cronCachedFileExpirationCheck.info("updateRunningJobs");
        RunHistoryHelper_1.RunHistoryHelper.updateRunningStatus().then(response => {
            Logger_1.Loggers.cronQueryServiceLog.info(`Triggered Query : ${JSON.stringify(response)}`);
        }).catch(error => {
            Logger_1.Loggers.cronQueryServiceLog.info('No Running items');
        });
    }
    checkRunningJobs() {
        let self = this;
        RunHistoryHelper_1.RunHistoryHelper.getRunning().then(response => {
            Logger_1.Loggers.cronQueryServiceLog.info(`Triggered query for running : ${JSON.stringify(response)}`);
            self.totalrunningrules = response.noofrunningrules;
            self.checkPendingJobs();
            Logger_1.Loggers.cronQueryServiceLog.info(`Total running rules: ${self.totalrunningrules}}`);
        }).catch(error => {
            Logger_1.Loggers.cronQueryServiceLog.info(`No running items`);
            self.totalrunningrules = 0;
            self.checkPendingJobs();
        });
    }
    checkPendingJobs() {
        let self = this;
        Logger_1.Loggers.cronQueryServiceLog.info("Checking for pending items");
        if (this.totalrunningrules >= Config_1.Config.RUNNING_LIMIT) {
            this.cronStop = true;
            self.cronTaskToCheckForPendingJobs.stop();
            return;
        }
        else {
            if (this.cronStop == true) {
                self.cronTaskToCheckForPendingJobs.start();
                this.cronStop = false;
            }
        }
        RunHistoryHelper_1.RunHistoryHelper.getPending().then(response => {
            Logger_1.Loggers.cronQueryServiceLog.info("Triggered query for : " + JSON.stringify(response));
            Logger_1.Loggers.cronQueryServiceLog.info(`Totalrunningrules:  ${JSON.stringify(response)}`);
            // self.cronTaskToCheckForPendingJobs.stop();
            self.triggerQuery(response);
        }).catch(err => {
            Logger_1.Loggers.cronQueryServiceLog.info("No pending items");
            // self.cronTaskToCheckForPendingJobs.start();
        });
    }
    /**
     * To be triggered from cron job
     * @param data
     */
    triggerQuery(data) {
        let self = this;
        RunHistoryHelper_1.RunHistoryHelper.updateTo(data.RuleRunID, data.RuleExecutedByUser, 'RUNNING', self.io, "null");
        let finalQuery = HiveQueries_1.HiveQueries.runRuleQuery(data);
        Logger_1.Loggers.serviceGtddlLog.info("QUERY : " + finalQuery);
        var options = {
            method: 'POST',
            uri: `${Config_1.Config.REST_END_POINT.BASE_PATH}${Config_1.Config.REST_END_POINT.QUERY_END_POINT}`,
            headers: {
                'Authorization': Config_1.Config.REST_END_POINT.AUTH,
                'Content-Type': 'application/json',
                'Accept': 'text/plain'
            },
            body: {
                query: finalQuery
            },
            json: true
        };
        this.updateHivePartitionMode().then((response) => {
            //Loggers.serviceGtddlLog.warn("Hive Partition info update resolved");
            requestPromise(options)
                .then((response) => {
                Logger_1.Loggers.serviceGtddlLog.info(`Success running Query`);
                Logger_1.Loggers.cronQueryServiceLog.info(`Run Success for RuleRunID[${data.RuleRunID}]`);
                this.getRunResultCountFromHive(data);
            })
                .catch((err) => {
                Logger_1.Loggers.serviceGtddlLog.error(`Failure running Query ERROR[${err}]`);
                Logger_1.Loggers.cronQueryServiceLog.error(`Run failed for RuleRunID[${data.RuleRunID}]`);
                RunHistoryHelper_1.RunHistoryHelper.updateTo(data.RuleRunID, data.RuleExecutedByUser, 'FAILED', self.io, "null", 'Error running hive query');
                self.checkRunningJobs();
            });
        }, error => {
            Logger_1.Loggers.serviceGtddlLog.error(`Failure updating Hive Partition info ERROR[${error}]`);
            Logger_1.Loggers.cronQueryServiceLog.error(`Run failed for RuleRunID[${data.RuleRunID}]`);
            RunHistoryHelper_1.RunHistoryHelper.updateTo(data.RuleRunID, data.RuleExecutedByUser, 'FAILED', self.io, "null", 'Error running hive query');
            self.checkRunningJobs();
        });
    }
    getRunResultCountFromHive(data) {
        let self = this;
        let options = {
            method: 'GET',
            uri: `${Config_1.Config.REST_END_POINT.BASE_PATH}${Config_1.Config.REST_END_POINT.SELECT_QUERY_END_POINT}?query=${HiveQueries_1.HiveQueries.getQueryForRunResultCountFromHive(data)}`,
            headers: {
                'Authorization': Config_1.Config.REST_END_POINT.AUTH1
            },
            json: true
        };
        Logger_1.Loggers.serviceGtddlLog.info(`Get run result count QUERY[${options.uri}]`);
        requestPromise(options)
            .then((response) => {
            if (response && response.rows && response.rows.length > 0 && response.rows[0]) {
                RunHistoryHelper_1.RunHistoryHelper.updateTo(data.RuleRunID, data.RuleExecutedByUser, 'COMPLETED', self.io, response.rows[0].total, "Get Count Success");
                Logger_1.Loggers.serviceGtddlLog.info(`Get run result count TOTAL[${response.rows[0].total}]`);
            }
            else {
                RunHistoryHelper_1.RunHistoryHelper.updateTo(data.RuleRunID, 'FAILED', self.io, "0", "Get count failed");
                Logger_1.Loggers.serviceGtddlLog.error(`Get run result count RESPONSE[${JSON.stringify(response)}]`);
            }
            self.checkRunningJobs();
        })
            .catch((err) => {
            RunHistoryHelper_1.RunHistoryHelper.updateTo(data.RuleRunID, data.RuleExecutedByUser, 'FAILED', self.io, "null", 'Get count threw errror');
            Logger_1.Loggers.serviceGtddlLog.error(`Get run result count ERROR[${err}]`);
            self.checkRunningJobs();
        });
    }
    updateHivePartitionMode() {
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
exports.QueryRunner = QueryRunner;
