import { Config } from './Config';
import * as Cryptr from 'cryptr';
import * as fse from 'fs-extra';
import * as jwt from 'jsonwebtoken';

export function normalizePort(val: number | string): number | string | boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}

export function errorHandler(err, req, res, next) {
    let responseModel = {
        status: err.status,
        message: "Error",
        reason: err.reason || null
    }
    switch (err.status) {
        case 404:
            responseModel.message = "Not found"
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

export function encrypt(message: string) {
    return new Cryptr(Config.SECRET.encryption_key).encrypt(message);
}

export function decrypt(message: string) {
    return new Cryptr(Config.SECRET.encryption_key).decrypt(message);
}

export function getRunResultFilePath(runRuleID): string {
    fse.ensureDir(Config.TEMP, err => {
        // No need to handle this
    })
    return `${Config.TEMP}/${runRuleID}.csv`;
}

export function atob(a) {
    return new Buffer(a, 'base64').toString('binary');
};

export function btoa(b) {
    return new Buffer(b).toString('base64');
};

export function getUserName(req) {
    return atob(decrypt(jwt.decode(req.headers['x-access-token']).data)).split(":") [0] || "Unknown";
}