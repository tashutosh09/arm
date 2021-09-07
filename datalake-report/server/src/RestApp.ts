import { Loggers } from './Logger';
import { Config } from './Config';
import { QueryRunner } from './runner/QueryRunner';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import routes from './routes/Router';
import { errorHandler } from './Helper';
import * as jwt from 'jsonwebtoken';
import * as  log4js from 'log4js';
import * as compression from 'compression';

// Creates and configures an ExpressJS web server.
class RestApp {

    // ref to Express instance
    public express: express.Application;
    private database;
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        // Log express to console
        this.express.use(log4js.connectLogger(Loggers.consoleLog, { level: 'auto', format: ':method :url' }));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    // Configure API endpoints.
    private routes(): void {
        this.express.use(cors());
        this.express.use(compression())

        // Non Authenticated routes
        this.express.use('/', express.static(__dirname + '/public'));
        this.express.use('/api/v1/auth', routes.login.router);
        this.express.use('/api/v1/companies', routes.companies.router);
        // TODO disable following route
        //this.express.use('/api/v1/test', routes.test.router);


        // Token validation
        this.express.use(function (req, res, next) {
            //console.log("===ARM TOKEN==="+req.headers['x-access-token']);
            next(); //Chinmay
            
            // check header for token
            /*var token = req.headers['x-access-token'];
            console.log("====My Token==="+token);
            // decode token
            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, Config.SECRET.jwt_key, function (err, decoded) {
                    if (err) {
                        //next();
                        return res.status(401).json({
                            code: 401,
                            message: 'Token expired'
                        });
                    } else {
                        next();
                    }
                });
                
            } else {
                return res.status(403).json({
                    code: 403,
                    message: 'Not Authorized'
                });
            }*/
        });

        // Authenticated routes
        this.express.use('/api/v1/rulegroup', routes.ruleGroup.router);
        this.express.use('/api/v1/rule', routes.rule.router);
        this.express.use('/api/v1/rulequery', routes.ruleQuery.router);
        this.express.use('/api/v1/rulerunhistory', routes.ruleRunHistory.router);
        this.express.use('/api/v1/config', routes.config.router);
        this.express.use('/api/v1/runresults/1', routes.runResults.router);
        this.express.use('/api/v1/logs', routes.logs.router);
        this.express.use('/api/v1/rulemetadata', routes.ruleMetaData.router);
        this.express.use('/api/v1/feeds', routes.feed.router);
        this.express.use('/api/v1/industryrule', routes.ruleIndustry.router);// 24022021

        // Error handling
        this.express.use(errorHandler);
    }

}

export default new RestApp().express;