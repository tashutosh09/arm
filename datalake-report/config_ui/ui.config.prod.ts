// I am configurable, but just to keep things simple I will take IP of the system I am hosted to call the rest end points
const hostName = window.location.hostname;
const port = window.location.port;

export const CONFIG_UI = {
    API: {
        METASTORE_BASE_PATH: `https://${hostName}:${port}/api/v1/`
        //METASTORE_BASE_PATH: `http://${hostName}:${port}/api/v1/`
    },
    SOCKET_CONFIG: {
        url: `https://${hostName}:${port}`,
        //url: `http://${hostName}:${port}`,
        options: {}
    },
    RUN_DETAILS: {
        ENABLE_SIZE_WARNING: true,
        SIZE_WARNING_COUNT: 5000,
        SIZE_WARNGIN_MESSAGE: 'Result set is large (5000+). Please consider viewing details offline'
    },
    ENABLE_LOGS: false
};
