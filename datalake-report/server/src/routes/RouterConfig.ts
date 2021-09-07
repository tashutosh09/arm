import { Router, Request, Response, NextFunction } from 'express';
import Database from '../database/Database';
import { DbQueries } from '../database/DbQueries';

export class RouterConfig {
    public router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/get', this.get);
    }

    public get(req: Request, res: Response, next: NextFunction) {
        Database.query(DbQueries.config()).then((result) => {
            res.send({
                status: true,
                results: result
            });
        }, (error) => {
            return next({ status: 500, reason: error });
        });
    }
}