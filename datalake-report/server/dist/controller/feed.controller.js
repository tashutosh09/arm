"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const feed_service_1 = require("../services/feed.service");
const Logger_1 = require("../Logger");
class FeedController {
    constructor() {
        this.feedService = new feed_service_1.FeedService();
    }
    getFeedNames(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = req.params.name;
            try {
                Logger_1.Loggers.consoleLog.info(`getFeedNames( name: ${name} )`);
                const feeds = yield this.feedService.getFeedsByName(name);
                if (!!feeds) {
                    const response = this.buildFeedNameResponse(feeds);
                    res.send(response);
                }
                else {
                    const response = this.buildFailureResponse(`No Feed found with category ${name}`);
                    res.send(response);
                }
            }
            catch (error) {
                Logger_1.Loggers.consoleLog.error(`getFeedNames Fault( error: ${error}, name: ${name} )`);
                return next({ status: 500 });
            }
        });
    }
    buildFailureResponse(message) {
        return {
            status: false,
            results: message
        };
    }
    buildFeedNameResponse(feeds) {
        return {
            status: true,
            results: feeds.map((feed) => {
                return {
                    name: feed,
                    systemName: feed
                };
            })
        };
    }
}
exports.FeedController = FeedController;
