"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./../Logger");
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/do");
const express_1 = require("express");
const Config_1 = require("../Config");
const requestPromise = require("request-promise");
class RouterCompanyNames {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.post('/get', this.get);
    }
    getOld(req, res, next) {
        if (req.body.flag) {
            Logger_1.Loggers.serviceGtddlLog.info(`Get Companies FLAG[${req.body.flag}]`);
            //let decoded: any = jwt.verify(req.headers['x-access-token'], Config.SECRET.jwt_key); //chinmay 
            requestPromise({
                uri: `${Config_1.Config.REST_END_POINT.BASE_PATH_AUTHZ}${Config_1.Config.REST_END_POINT.CATEGORUES_END_POINT}`,
                headers: {
                //'x-access-token': `${decrypt(decoded['data'])}` //chinmay 
                },
                json: true
            }).then((response) => {
                Logger_1.Loggers.serviceGtddlLog.info(`Get Companies Success FLAG[${req.body.flag}]`);
                Observable_1.Observable.of(response)
                    .map(data => JSON.parse(data)
                    .filter(data => {
                    // if (data.userProperties != null && data.userProperties.length > 0) {
                    //     for (let item of data.userProperties) {
                    //         // TODO make item.value Dynamic
                    //         return item.systemName == req.body.flag && item.value == 'TRUE';
                    //     }
                    // }
                    // return false;
                    if (data != null && data.length > 0) {
                        Logger_1.Loggers.serviceGtddlLog.info(data.systemname);
                        return false;
                    }
                    Logger_1.Loggers.serviceGtddlLog.info(`Get Companies false`);
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
                        };
                    });
                })
                    .subscribe(data => {
                    Logger_1.Loggers.serviceGtddlLog.info(`Get Companies Returned FLAG[${req.body.flag}]`);
                    res.send({
                        status: true,
                        results: data
                    });
                });
            }).catch((err) => {
                Logger_1.Loggers.serviceGtddlLog.info(`Get Companies Failed ERROR[${err}] FLAG[${req.body.flag}]`);
                return next({ status: 500, reason: err });
            });
        }
        else {
            return next({ status: 400 });
        }
    }
    get(req, res, next) {
        if (req.body.flag) {
            return {
                id: "7145f363-9072-4c02-8bb6-869093e6d2ff",
                systemName: "qa_test",
                name: "qa_test",
                icon: "null",
                iconColor: "null"
            };
        }
    }
}
exports.RouterCompanyNames = RouterCompanyNames;
