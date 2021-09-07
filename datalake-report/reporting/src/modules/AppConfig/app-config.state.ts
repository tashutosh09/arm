import { AppConfig } from "../../models/config.mdl";

export interface AppConfigState {
    loading: boolean;
    config: AppConfig[];
}

export const initialAppConfigState: AppConfigState = {
    loading: false,
    config: []
}