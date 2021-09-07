"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Database_1 = require("../database/Database");
const DbQueries_1 = require("../database/DbQueries");
class RouterRuleMetaData {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.post('/:action', this.handle);
    }
    handle(req, res, next) {
        if (req.params && req.params.action) {
            let query = null;
            let user = null;
            if (req.body && req.body.user) {
                user = req.body.user;
            }
            switch (req.params.action) {
                case 'get':
                    query = DbQueries_1.DbQueries.ruleRunHistoryMetaData(user);
                    break;
            }
            if (query) {
                Database_1.default.query(query).then((result) => {
                    res.send({
                        status: true,
                        results: result
                    });
                }, (error) => {
                    return next({ status: 500, reason: error });
                });
                return;
            }
        }
        return next({ status: 400 });
    }
}
exports.RouterRuleMetaData = RouterRuleMetaData;
