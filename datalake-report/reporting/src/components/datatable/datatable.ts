import { Component, Input } from '@angular/core';
declare var $: any;
declare var Papa: any;
declare var DataTable: any;

@Component({
  selector: 'datatable',
  templateUrl: 'datatable.html'
})
export class DatatableComponent {
  @Input()
  csv: string;

  constructor() {
  }

  ngOnInit() {
    if (this.csv && this.csv['size'] > 0 && $ != undefined) {
      Papa.parse(this.csv, {
        "header": true,
        "keepEmptyRows": false,
        "skipEmptyLines": true,
        "dynamicTyping": true,
        "complete": results => {
          if ($.fn.DataTable.isDataTable($("#my-datatable"))) {
            $('#my-datatable').empty();
          }
          $.fn.dataTable.ext.errMode = 'none';
          $("#my-datatable").DataTable({
            "responsive": true,
            "columns": results.meta.fields.map(c => ({
              "title": c,
              "data": c,
              "default": ""
            })),
            "deferRender": true,
            "data": results.data,
            "scrollCollapse": true,
            "scroller": true,
            "drawCallback": function (settings) {
              console.log("Rendered");
            }
          });
        }
      });
    }
  }

}
