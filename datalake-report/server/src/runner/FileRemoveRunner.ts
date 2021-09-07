import { Loggers } from './../Logger';
import { Config } from './../Config';
import * as cron from 'node-cron';
import * as path from 'path';
import * as fse from 'fs-extra';

export class FileRemoveRunner {
    public cronTaskToCheckForRemovingOldFiles: any;

    constructor() {
        this.init();
    }

    public init() {
        let self = this;
        this.cronTaskToCheckForRemovingOldFiles = cron.schedule(Config.RULE_RUN_HISTORY_CACHE.TIMER, function () {
            Loggers.cronCachedFileExpirationCheck.info("Looking for old files and removing them");
            fse.readdir(Config.TEMP, function (err, files) {
                if (files && files.length > 0) {
                    files.forEach(function (file, index) {
                        let filePath = path.join(Config.TEMP, file);
                        fse.stat(filePath, function (err, stat) {
                            var endTime, now;
                            if (err) {
                                return console.error(err);
                            }
                            now = new Date().getTime();
                            endTime = new Date(stat.ctime).getTime() + (Config.RULE_RUN_HISTORY_CACHE.LIFE * 1000);
                            if (now > endTime) {
                                return fse.remove(filePath, function (err) {
                                    if (err) {
                                        return console.error(err);
                                    }
                                    Loggers.cronCachedFileExpirationCheck.warn("Deleted file : " + filePath);
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