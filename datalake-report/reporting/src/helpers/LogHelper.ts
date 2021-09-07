import { CONFIG_UI } from './../app/app.config';
export function logMessage(message: string) {
    if (CONFIG_UI.ENABLE_LOGS) {
        console.log(message);
    }
}
