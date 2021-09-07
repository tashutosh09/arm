import { Loggers } from './../Logger';
import { decrypt} from '../Helper';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import Database from '../database/Database';
import { DbQueries } from '../database/DbQueries';
import * as jwt from'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';
import { Config } from '../Config';
import * as requestPromise from 'request-promise';
export class RouterCompanyNames {
    public router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/get', this.get);
    }

    public getOld(req: Request, res: Response, next: NextFunction) {
        if (req.body.flag) {
            Loggers.serviceGtddlLog.info(`Get Companies FLAG[${req.body.flag}]`);
            let decoded: any = jwt.verify(req.headers['x-access-token'], Config.SECRET.jwt_key); //chinmay 
            requestPromise({
                uri: `${Config.REST_END_POINT.BASE_PATH_AUTHZ}${Config.REST_END_POINT.CATEGORUES_END_POINT}`,
                headers: {
                    'x-access-token': `${decrypt(decoded['data'])}` //chinmay 
                },
                json: true
            }).then((response) => {
                Loggers.serviceGtddlLog.info(`Get Companies Success FLAG[${req.body.flag}]`);
               
                Observable.of(response)
                    .map(data => JSON.parse(data)
                        .filter(data => {
                            // if (data.userProperties != null && data.userProperties.length > 0) {
                            //     for (let item of data.userProperties) {
                            //         // TODO make item.value Dynamic
                            //         return item.systemName == req.body.flag && item.value == 'TRUE';
                            //     }
                            // }
                            // return false;
                            if(data != null && data.length > 0) {
                                Loggers.serviceGtddlLog.info(data.systemname);
                                return false;
                            }
                            Loggers.serviceGtddlLog.info(`Get Companies false`);
                            return true;
                        }))
                    .map(data => {
                        return data.map(item => {
                            return {
                                id: item.id,
                                systemName: item.systemName,
                                name: item.name,
                                icon: item.icon,
                                iconColor: item.iconColor
                            }
                        });
                    })
                    .subscribe(data => {
                        Loggers.serviceGtddlLog.info(`Get Companies Returned FLAG[${req.body.flag}]`);

                        res.send({
                            status: true,
                            results: data
                        });
                    });


            }).catch((err) => {
                Loggers.serviceGtddlLog.info(`Get Companies Failed ERROR[${err}] FLAG[${req.body.flag}]`);
                return next({ status: 500, reason: err });
            });
        } else {
            return next({ status: 400 });
        }
    }

    public get(req: Request, res: Response, next: NextFunction) {
        //console.log("===ARM X-Access-Token==="+req.headers['x-access-token']);
        let username = req.body.UserName;
        //console.log("===== +++" + username);
        let query = DbQueries.getCompanyNames(username);
        //console.log("===== +++" + query);
        
        Database.query(query).then((data) => {
            //console.log("===== +++" + JSON.stringify(data));
           const companyNames = data.map(companyObj => companyObj.CompanyName);
           //console.log("=====Companies +++" + companyNames);
           data = [];
        
           for (let company of companyNames) {
                data.push({
                    id:'null',
                    name:company,
                    systemName: company,
                    icon:'null',
                    iconColor:'null'
                });    
           }
           
           /* res.send({
                status: true,
                results: companynames
            });
            */
            Observable.of(data)
            .map(data => {                
                return data.map(item => {
                    return {
                        id: item.id,
                        systemName: item.systemName,
                        name: item.name,
                        icon: item.icon,
                        iconColor: item.iconColor
                    }
                });
            })
            .subscribe(data => {
                res.send({
                    status: true,
                    results: data
                });
            });
        
        }, (error) => {
            return next({ status: 500, reason: error });
        });
    }


}
