export const EXTERNAL_SCRIPTS = {
    JQUERY: {
        type: 'js',
        value: 'https://code.jquery.com/jquery-3.2.1.min.js'
    },
    DATATABLE_STYLE: {
        type: 'css',
        value: 'http://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css'
    },
    DATATABLE_JQUERY: {
        type: 'js',
        value: 'http://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js'
    },
    PAPAPARSE: {
        type: 'js',
        value: 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.2.0/papaparse.min.js'
    }
}


export function scriptLoader(scripts: {
    type: string,
    value: string
}[]): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        for (let item of scripts) {
            let node;
            if (item.type == 'css') {
                node = document.createElement('link');
                node.href = item.value;
                node.rel = "stylesheet";
                node.type = "text/css"
            } else if (item.type == 'js') {
                node = document.createElement('script');
                node.src = item.value;
                node.type = 'text/javascript';
                node.async = false;
            }
            document.getElementsByTagName('head')[0].appendChild(node);
        }
        resolve(true);
    });
}