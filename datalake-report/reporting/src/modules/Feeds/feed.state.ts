import { Feed } from "../../models/feed.mdl";

export interface FeedState {
    loading: boolean;
    result: Feed[];
}

export const initialFeedState: FeedState = {
    loading: false,
    result: []
}