export interface MetaDataState {
    loading: boolean;
    ruleCounts?:{
        total: number,
        failed: number,
        completed: number,
        pending: number,
        running: number,
        my_total: number,
        my_failed: number,
        my_completed: number,
        my_pending: number,
        my_running: number
    }
}

export const initialMetaDataState: MetaDataState = {
    loading: false
};
