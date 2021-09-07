"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Router_1 = require("./routes/Router");
const Helper_1 = require("./Helper");
const log4js = require("log4js");
const compression = require("compression");
// Creates and configures an ExpressJS web server.
class RestApp {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        // Log express to console
        this.express.use(log4js.connectLogger(Logger_1.Loggers.consoleLog, { level: 'auto', format: ':method :url' }));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    // Configure API endpoints.
    routes() {
        this.express.use(cors());
        this.express.use(compression());
        // Non Authenticated routes
        this.express.use('/', express.static(__dirname + '/public'));
        this.express.use('/api/v1/auth', Router_1.default.login.router);
        this.express.use('/api/v1/companies', Router_1.default.companies.router);
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
        this.express.use('/api/v1/rulegroup', Router_1.default.ruleGroup.router);
        this.express.use('/api/v1/rule', Router_1.default.rule.router);
        this.express.use('/api/v1/rulequery', Router_1.default.ruleQuery.router);
        this.express.use('/api/v1/rulerunhistory', Router_1.default.ruleRunHistory.router);
        this.express.use('/api/v1/config', Router_1.default.config.router);
        this.express.use('/api/v1/runresults/1', Router_1.default.runResults.router);
        this.express.use('/api/v1/logs', Router_1.default.logs.router);
        this.express.use('/api/v1/rulemetadata', Router_1.default.ruleMetaData.router);
        this.express.use('/api/v1/feeds', Router_1.default.feed.router);
        this.express.use('/api/v1/industryrule', Router_1.default.ruleIndustry.router); // 24022021
        // Error handling
        this.express.use(Helper_1.errorHandler);
    }
}
exports.default = new RestApp().express;
