import { Config } from './../Config';
import { Router, Request, Response, NextFunction } from 'express';
import * as fse from 'fs-extra';
import * as  zlib from 'zlib';
import { DbQueries } from '../database/DbQueries';
import Database from '../database/Database';
import * as jwt from 'jsonwebtoken';
import * as Helper from '../Helper';
import { Loggers } from '../Logger';

export class RouterLogs {
    public router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/get', this.get);
        this.router.get('/getUserLogs', this.getUserLogs)
    }

    public get(req: Request, res: Response, next: NextFunction) {
        let logsPath = `${Config.LOGS}/main.log`;
        console.log(fse.existsSync(logsPath));

        if (fse.existsSync(logsPath)) {
            res.writeHead(200, { 'Content-Encoding': 'gzip' });
            const gzip = zlib.createGzip();
            const src = fse.createReadStream(logsPath);
            src.pipe(gzip).pipe(res);
        } else {
            res.end(404);
        }
    }

    public getUserLogs(req: Request, res: Response, next: NextFunction) {
        // Read from Db
        //Chinmay Start
        
        /*const decoded = jwt.verify(req.headers['x-access-token'], Config.SECRET.jwt_key);
        const token = Helper.decrypt(decoded['data']);
        const real_loginauth = Buffer.from(token, 'base64').toString('ascii'); 
        const splitted = real_loginauth.split(":",2); 
        const uName =splitted[0];
        if (!uName) {
            return next({ status: 401, reason: 'User Name Not Found' });
        }*/
        
        //Chinmay End
        Loggers.serviceGtddlLog.info('getUserLogs Request '+JSON.stringify(req));
        const uName = 'sounak';
        const userRuleRunDetailsQuery = DbQueries.getRuleRunHistoryViaUserQuery(uName);
        const parseRuleRunResults = (dbDataRowPackets, uName) => {
            let parsedDataString = '';
            for (let row of dbDataRowPackets) {
                const { RuleID,
                    RuleQueryFinalString,
                    RuleRunStartTime,
                    RuleRunEndTime,
                    RunStatus,
                    company_name } = row;
                parsedDataString += `User: ${uName} executed RuleId: ${RuleID},
                RuleQueryFinalString: ${RuleQueryFinalString}
                at Start Time: ${RuleRunStartTime}
                and ended at End Time: ${RuleRunEndTime} 
                with Status: ${RunStatus} for company ${company_name}` + '\n\n\n ';

            }
            return parsedDataString;
        }
        if (userRuleRunDetailsQuery) {
            Database.query(userRuleRunDetailsQuery).then((result) => {
                if (result && result.length > 0) {
                    // parse data into stringified format
                    const ruleRunResultsDataStr = parseRuleRunResults(result, uName);
                    const ruleRunLogsPath = `${Config.LOGS}/${uName}.txt`;
                    // Write to file
                    fse.writeFile(ruleRunLogsPath, ruleRunResultsDataStr, (err) => {
                        // throws an error, you could also catch it here
                        if (err) return next({ status: 500, reason: err });
                        if (fse.existsSync(ruleRunLogsPath)) {
                            res.writeHead(200, { 'Content-Encoding': 'gzip' });
                            const gzip = zlib.createGzip();
                            const src = fse.createReadStream(ruleRunLogsPath);
                            src.pipe(gzip).pipe(res);
                        } else {
                            res.end(404);
                        }
                    });
                } else {
                    return next({ status: 500, reason: 'No logs exists for the user' });
                }
                //set encoding and send for download
            }, (error) => {
                return next({ status: 500, reason: error });
            });
            return;
        }




    }
}