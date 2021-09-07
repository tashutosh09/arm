import { Router, Request, Response, NextFunction } from 'express';
import Database from '../database/Database';
import { DbQueries } from '../database/DbQueries';
import { Config } from '../Config';

export class RouterRuleMetaData {
    public router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/:action', this.handle);
    }

    public handle(req: Request, res: Response, next: NextFunction) {
        if (req.params && req.params.action) {

            let query = null;
            let user = null;
            if (req.body && req.body.user) {
                user = req.body.user;
            }

            switch (req.params.action) {
                case 'get':
                    query = DbQueries.ruleRunHistoryMetaData(user);
                    break;
            }

            if (query) {
                Database.query(query).then((result) => {
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