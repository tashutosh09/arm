"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./../Logger");
const Config_1 = require("./../Config");
const cron = require("node-cron");
const path = require("path");
const fse = require("fs-extra");
class FileRemoveRunner {
    constructor() {
        this.init();
    }
    init() {
        let self = this;
        this.cronTaskToCheckForRemovingOldFiles = cron.schedule(Config_1.Config.RULE_RUN_HISTORY_CACHE.TIMER, function () {
            Logger_1.Loggers.cronCachedFileExpirationCheck.info("Looking for old files and removing them");
            fse.readdir(Config_1.Config.TEMP, function (err, files) {
                if (files && files.length > 0) {
                    files.forEach(function (file, index) {
                        let filePath = path.join(Config_1.Config.TEMP, file);
                        fse.stat(filePath, function (err, stat) {
                            var endTime, now;
                            if (err) {
                                return console.error(err);
                            }
                            now = new Date().getTime();
                            endTime = new Date(stat.ctime).getTime() + (Config_1.Config.RULE_RUN_HISTORY_CACHE.LIFE * 1000);
                            if (now > endTime) {
                                return fse.remove(filePath, function (err) {
                                    if (err) {
                                        return console.error(err);
                                    }
                                    Logger_1.Loggers.cronCachedFileExpirationCheck.warn("Deleted file : " + filePath);
                                });
                            }
                        });
                    });
                }
            });
        }, false);
        this.cronTaskToCheckForRemovingOldFiles.start();
    }
}
exports.FileRemoveRunner = FileRemoveRunner;
