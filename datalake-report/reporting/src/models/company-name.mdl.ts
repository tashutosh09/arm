import { Feed } from './feed.mdl';

export interface CompanyName {
    name: string;
    systemName: string;
    icon: string;
    iconColor: string;
    id: string;
    feeds: Array<Feed>
}
