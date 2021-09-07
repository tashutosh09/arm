"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const Cryptr = require("cryptr");
const fse = require("fs-extra");
const jwt = require("jsonwebtoken");
function normalizePort(val) {
    let port = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port))
        return val;
    else if (port >= 0)
        return port;
    else
        return false;
}
exports.normalizePort = normalizePort;
function errorHandler(err, req, res, next) {
    let responseModel = {
        status: err.status,
        message: "Error",
        reason: err.reason || null
    };
    switch (err.status) {
        case 404:
            responseModel.message = "Not found";
            break;
        case 500:
            responseModel.message = "Request failed with a error";
            break;
        case 400:
            responseModel.message = "Parameter missing";
            break;
        case 412:
            responseModel.message = "Data missing";
            break;
        default:
            return next();
    }
    res.status(responseModel.status).json(responseModel);
    res.end();
}
exports.errorHandler = errorHandler;
function encrypt(message) {
    return new Cryptr(Config_1.Config.SECRET.encryption_key).encrypt(message);
}
exports.encrypt = encrypt;
function decrypt(message) {
    return new Cryptr(Config_1.Config.SECRET.encryption_key).decrypt(message);
}
exports.decrypt = decrypt;
function getRunResultFilePath(runRuleID) {
    fse.ensureDir(Config_1.Config.TEMP, err => {
        // No need to handle this
    });
    return `${Config_1.Config.TEMP}/${runRuleID}.csv`;
}
exports.getRunResultFilePath = getRunResultFilePath;
function atob(a) {
    return new Buffer(a, 'base64').toString('binary');
}
exports.atob = atob;
;
function btoa(b) {
    return new Buffer(b).toString('base64');
}
exports.btoa = btoa;
;
function getUserName(req) {
    return atob(decrypt(jwt.decode(req.headers['x-access-token']).data)).split(":")[0] || "Unknown";
}
exports.getUserName = getUserName;
