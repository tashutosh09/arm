"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class RouterTest {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.get('/socket', this.get);
    }
    get(req, res, next) {
        var io = req.app.get('socketio');
        io.emit(req.query.topic, req.query.message);
        res.end();
    }
}
exports.RouterTest = RouterTest;
