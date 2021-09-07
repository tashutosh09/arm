import { Config } from '../Config';
import { Constants } from '../Constants';
import * as jwt from 'jsonwebtoken';
import * as Helper from '../Helper';
import { Loggers } from '../Logger';
import { Router, Request, Response, NextFunction } from 'express';
import Database from '../database/Database';
import { DbQueries } from '../database/DbQueries';

export class RouterRule {
    public router: Router
    
    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/:action', this.handle);
        this.router.get('/params', this.getRuleParams)
    }

    public handle(req: Request, res: Response, next: NextFunction) {
        if (req.params && req.params.action) {

            let query = null,
                username2 = '';
            switch (req.params.action) {
                case 'get':
                    if (req.body && req.body.RuleSubGroupID) {
                        //Loggers.serviceGtddlLog.info(`line case get for view RuleGroups get entered ${req.headers['x-access-token']}`);
                        //chinmay Start 
                        
                        /*let decoded = jwt.verify(req.headers['x-access-token'], Config.SECRET.jwt_key);
                        let token = Helper.decrypt(decoded['data']);
                        Loggers.serviceGtddlLog.info(`line case get for view RuleGroup token ${token}`);
                        let real_loginauth = Buffer.from(token, 'base64').toString('ascii');
                        let splitted = real_loginauth.split(":", 2);
                        username2 = splitted[0];*/
                        
                        //Chinmay End
                        //username2 = 'qatest_user';
                        username2 = req.body.UserName;
                        Loggers.serviceGtddlLog.info(`line case get for view Rule username ${username2}`);
                        query = DbQueries.rules(req.body.RuleSubGroupID, username2);
                    }
                    break;
            }

            if (query) {
                Database.query(query).then((result) => {
                    res.send({
                        status: true,
                        results: result,
                        user: username2
                    });
                }, (error) => {
                    return next({ status: 500, reason: error });
                });
                return;
            }
        }
        return next({ status: 400 });
    }

    public getRuleParams(req: Request, res: Response, next: NextFunction) {
        //console.log("====getRuleParams======");
        let ruleList = req.query.RuleIdList;
        if (ruleList) {
            ruleList = JSON.parse(ruleList);
            const rulesString = ruleList.map(rule => `'${rule}'`).join(',');
            const query = DbQueries.getParams(rulesString);
            if (query) {
                Database.query(query).then((result) => {
                    const params = result.map(paramObj => JSON.parse(paramObj.PARAM));
                    //console.log("+++++++ Data++++ "+ JSON.stringify(params));
                    res.send({
                        status: true,
                        results: params
                    });
                }, (error) => {
                    return next({ status: 500, reason: error });
                });
            }
        } else {
            return next({ status: 404, reason: 'Rules Missing' });
        }
    }
}