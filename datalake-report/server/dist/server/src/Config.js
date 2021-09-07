"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
exports.Config = JSON.parse(fs.readFileSync(process.argv.slice(2)[0], 'utf8'));
