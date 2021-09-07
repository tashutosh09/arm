import { CompanyName } from "../../models/company-name.mdl";

export interface CompanyNamesState {
    loading: boolean;
    result: CompanyName[];
}

export const initialCompanyNamesState: CompanyNamesState = {
    loading: false,
    result: []
}