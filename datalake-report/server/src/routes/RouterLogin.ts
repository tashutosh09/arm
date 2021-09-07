import { Loggers } from './../Logger';
import { Config } from './../Config';
import { Observable } from "rxjs/Observable";
import { Router, Request, Response, NextFunction } from 'express';
import * as requestPromise from 'request-promise';
import * as jwt from 'jsonwebtoken';
import { encrypt } from '../Helper';

export class RouterLogin {
    public router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/login', this.login);
        this.router.post('/check', this.check);
    }

    public check(req: Request, res: Response, next: NextFunction) {
        if (req.body.accessToken) {
            jwt.verify(req.body.accessToken, Config.SECRET.jwt_key, (err, decoded) => {
                if (err) {
                    res.send({
                        status: false
                    });
                } else {
                    res.send({
                        status: true
                    });
                }
            });
        } else {
            return next({ status: 400 });
        }
    }

    public login(req: Request, res: Response, next: NextFunction) {
        if (req.body.token) {
            var options = {
                uri: `${Config.REST_END_POINT.BASE_PATH_AUTHN}${Config.REST_END_POINT.USER_DETAILS}`,
                headers: {
                    'x-access-token': `${req.body.token}`
                },
                json: true
            };

            Loggers.serviceGtddlLog.info(`Login attempt`);
            requestPromise(options)
                .then((response) => {
                    Loggers.serviceGtddlLog.info(`Login success`);
                    let aboutRet = JSON.parse(response)
                    let aboutPart = { "displayName" : aboutRet.displayName,"email" : "","enabled" : "true","groups" : aboutRet.groups ,"systemName" : aboutRet.systemName}
                    //var ret = JSON.stringify(response)
                    Loggers.serviceGtddlLog.info(aboutPart.systemName);
                    res.send({
                        status: true,
                        results: {
                            accessToken: jwt.sign({
                                data: encrypt(req.body.token)
                            }, Config.SECRET.jtw_key, { expiresIn: Config.SECRET.expiresIn }),
                            expiresIn: (Date.now() + (Config.SECRET.expiresIn * 1000)),
                            displayName: aboutRet.displayName,
                            systemName: aboutRet.systemName,
                            email: ''
                        }
                    });
                })
                .catch((err) => {
                    Loggers.serviceGtddlLog.info(`Login failed ERROR[${err}]`);
                    res.send({
                        status: false,
                        results: err
                    });
                });
        } else {
            return next({ status: 400 });
        }
    }
}