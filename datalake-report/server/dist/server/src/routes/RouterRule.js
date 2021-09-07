"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../Logger");
const express_1 = require("express");
const Database_1 = require("../database/Database");
const DbQueries_1 = require("../database/DbQueries");
class RouterRule {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.post('/:action', this.handle);
        this.router.get('/params', this.getRuleParams);
    }
    handle(req, res, next) {
        if (req.params && req.params.action) {
            let query = null, username2 = '';
            switch (req.params.action) {
                case 'get':
                    if (req.body && req.body.RuleSubGroupID) {
                        Logger_1.Loggers.serviceGtddlLog.info(`line case get for view RuleGroups get entered ${req.headers['x-access-token']}`);
                        //chinmay Start 
                        /*let decoded = jwt.verify(req.headers['x-access-token'], Config.SECRET.jwt_key);
                        let token = Helper.decrypt(decoded['data']);
                        Loggers.serviceGtddlLog.info(`line case get for view RuleGroup token ${token}`);
                        let real_loginauth = Buffer.from(token, 'base64').toString('ascii');
                        let splitted = real_loginauth.split(":", 2);
                        username2 = splitted[0];*/
                        //Chinmay End
                        username2 = 'qatest_user';
                        Logger_1.Loggers.serviceGtddlLog.info(`line case get for view Rule username ${username2}`);
                        query = DbQueries_1.DbQueries.rules(req.body.RuleSubGroupID, username2);
                    }
                    break;
            }
            if (query) {
                Database_1.default.query(query).then((result) => {
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
    getRuleParams(req, res, next) {
        console.log("====getRuleParams======");
        let ruleList = req.query.RuleIdList;
        if (ruleList) {
            ruleList = JSON.parse(ruleList);
            const rulesString = ruleList.map(rule => `'${rule}'`).join(',');
            const query = DbQueries_1.DbQueries.getParams(rulesString);
            if (query) {
                Database_1.default.query(query).then((result) => {
                    const params = result.map(paramObj => JSON.parse(paramObj.PARAM));
                    res.send({
                        status: true,
                        results: params
                    });
                }, (error) => {
                    return next({ status: 500, reason: error });
                });
            }
        }
        else {
            return next({ status: 404, reason: 'Rules Missing' });
        }
    }
}
exports.RouterRule = RouterRule;
