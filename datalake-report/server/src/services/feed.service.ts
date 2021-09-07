import { KyloClient } from '../client/kylo.client';
import { Loggers } from '../Logger';

export class FeedService {

    private kyloClient: KyloClient; 

    constructor(){
        this.kyloClient = new KyloClient();
    }

    public async getFeedsByName(name: String) {
        try {
            Loggers.consoleLog.info(`getFeedsByName( name: ${name} )`);
            const tables = await this.kyloClient.getHiveTablesBySchema(name);
            if(!!tables) {
                const feeds: Array<String> = this.filterTables(tables);
                Loggers.consoleLog.debug(`getTablesByName Success( feeds: ${JSON.stringify(feeds, null, "\t")}, name: ${name} )`);
                return feeds;
            }
            Loggers.consoleLog.warn(`getFeedsByName not found with name: ${name}`);
            return null;
        } catch(error) {
            Loggers.consoleLog.error(`getFeedsByName Fault( error:${error}, name: ${name} )`);
            throw error; 
        }
    }

    private filterTables(tables: Array<String>) : Array<String> {
        return tables.filter((table: String) => {
            const name : String = table.split(".")[1];
            return !name.endsWith("_valid") && !name.endsWith("_feed") 
            && !name.endsWith("_profile") && !name.endsWith("_invalid");
        }).map((table: String) => table.split(".")[1]);
    }

}