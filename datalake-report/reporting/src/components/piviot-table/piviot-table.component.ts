import { Component, Input } from '@angular/core';

declare var $: any;
declare var Papa: any;

@Component({
    selector: 'piviot-table',
    templateUrl: 'piviot-table.html'
})
export class PiviotTableComponent {
    @Input()
    csv: string;

    constructor() {
    }

    ngOnInit() {
        if (this.csv && $ != undefined) {
            $.extend(
                $.pivotUtilities.renderers,
                $.pivotUtilities.c3_renderers,
                $.pivotUtilities.d3_renderers,
                $.pivotUtilities.export_renderers
            );
            Papa.parse(this.csv, {
                header: false,
                skipEmptyLines: true,
                error: function (e) { alert(e) },
                complete: function (parsed) {
                    $("#output").pivotUI(parsed.data, { renderers: this.renderers }, true);
                }
            });
        }
    }
}