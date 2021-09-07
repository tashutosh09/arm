"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./../Logger");
const Config_1 = require("./../Config");
const express_1 = require("express");
const requestPromise = require("request-promise");
const jwt = require("jsonwebtoken");
const Helper_1 = require("../Helper");
class RouterLogin {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.post('/login', this.login);
        this.router.post('/check', this.check);
    }
    check(req, res, next) {
        if (req.body.accessToken) {
            jwt.verify(req.body.accessToken, Config_1.Config.SECRET.jwt_key, (err, decoded) => {
                if (err) {
                    res.send({
                        status: false
                    });
                }
                else {
                    res.send({
                        status: true
                    });
                }
            });
        }
        else {
            return next({ status: 400 });
        }
    }
    login(req, res, next) {
        if (req.body.token) {
            var options = {
                uri: `${Config_1.Config.REST_END_POINT.BASE_PATH_AUTHN}${Config_1.Config.REST_END_POINT.USER_DETAILS}`,
                headers: {
                    'x-access-token': `${req.body.token}`
                },
                json: true
            };
            Logger_1.Loggers.serviceGtddlLog.info(`Login attempt`);
            requestPromise(options)
                .then((response) => {
                Logger_1.Loggers.serviceGtddlLog.info(`Login success`);
                let aboutRet = JSON.parse(response);
                let aboutPart = { "displayName": aboutRet.displayName, "email": "", "enabled": "true", "groups": aboutRet.groups, "systemName": aboutRet.systemName };
                //var ret = JSON.stringify(response)
                Logger_1.Loggers.serviceGtddlLog.info(aboutPart.systemName);
                res.send({
                    status: true,
                    results: {
                        accessToken: jwt.sign({
                            data: Helper_1.encrypt(req.body.token)
                        }, Config_1.Config.SECRET.jtw_key, { expiresIn: Config_1.Config.SECRET.expiresIn }),
                        expiresIn: (Date.now() + (Config_1.Config.SECRET.expiresIn * 1000)),
                        displayName: aboutRet.displayName,
                        systemName: aboutRet.systemName,
                        email: ''
                    }
                });
            })
                .catch((err) => {
                Logger_1.Loggers.serviceGtddlLog.info(`Login failed ERROR[${err}]`);
                res.send({
                    status: false,
                    results: err
                });
            });
        }
        else {
            return next({ status: 400 });
        }
    }
}
exports.RouterLogin = RouterLogin;
