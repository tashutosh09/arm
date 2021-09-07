import { Request, Response, NextFunction } from 'express';
import { FeedService } from "../services/feed.service";
import { Loggers } from '../Logger';

export class FeedController {

    private feedService: FeedService;

    constructor() {
        this.feedService = new FeedService();
    }

    public async getFeedNames(req: Request, res: Response, next: NextFunction) {
        const name: String = req.params.name;
        try {
            Loggers.consoleLog.info(`getFeedNames( name: ${name} )`);
            const feeds = await this.feedService.getFeedsByName(name);
            if(!!feeds) {
                const response = this.buildFeedNameResponse(feeds);
                res.send(response);
            } else {
                const response = this.buildFailureResponse(`No Feed found with category ${name}`);
                res.send(response);
            }
        } catch(error) {
            Loggers.consoleLog.error(`getFeedNames Fault( error: ${error}, name: ${name} )`);
            return next({status: 500});
        }
    }

    private buildFailureResponse(message: String) : Object {
        return {
            status: false,
            results: message
        }
    }

    private buildFeedNameResponse(feeds: any) : Object {
        return {
            status: true,
            results: feeds.map((feed) => {
               return {
                name: feed,
                systemName: feed
               } 
            })
        };
    }

}