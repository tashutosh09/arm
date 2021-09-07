import { Router } from 'express';
import { FeedController } from '../controller/feed.controller';

export class RouterFeed {
    
    public router: Router;
    private feedController: FeedController;

    constructor() {
        this.router = Router();
        this.feedController = new FeedController();
        this.routes();
    }

    private routes() {
        this.router.get('/:name', this.feedController.getFeedNames.bind(this.feedController)); 
    }

}