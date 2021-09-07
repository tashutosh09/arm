import { Loggers } from './../Logger';
import { Router, Request, Response, NextFunction } from 'express';
import Database from '../database/Database';
import { DbQueries } from '../database/DbQueries';

export class RouterTest {
    public router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/socket', this.get);
    }

    public get(req: Request, res: Response, next: NextFunction) {
        var io = req.app.get('socketio');
        io.emit(req.query.topic, req.query.message);
        res.end();
    }
}