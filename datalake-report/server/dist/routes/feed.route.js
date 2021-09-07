"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feed_controller_1 = require("../controller/feed.controller");
class RouterFeed {
    constructor() {
        this.router = express_1.Router();
        this.feedController = new feed_controller_1.FeedController();
        this.routes();
    }
    routes() {
        this.router.get('/:name', this.feedController.getFeedNames.bind(this.feedController));
    }
}
exports.RouterFeed = RouterFeed;
