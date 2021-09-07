"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Database_1 = require("../database/Database");
const DbQueries_1 = require("../database/DbQueries");
class RouterConfig {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.post('/get', this.get);
    }
    get(req, res, next) {
        Database_1.default.query(DbQueries_1.DbQueries.config()).then((result) => {
            res.send({
                status: true,
                results: result
            });
        }, (error) => {
            return next({ status: 500, reason: error });
        });
    }
}
exports.RouterConfig = RouterConfig;
