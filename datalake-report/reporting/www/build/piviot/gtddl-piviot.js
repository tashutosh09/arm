$(function () {

    var renderers = $.extend(
        $.pivotUtilities.renderers,
        $.pivotUtilities.c3_renderers,
        $.pivotUtilities.d3_renderers,
        $.pivotUtilities.export_renderers
    );
    var parseAndPivot = function (f) {
        $("#output").html("<p align='center' style='color:grey;'>(processing...)</p>")
        Papa.parse(f, {
            skipEmptyLines: true,
            error: function (e) { alert(e) },
            complete: function (parsed) {
                $("#output").pivotUI(parsed.data, { renderers: renderers }, true);
            }
        });
    };

    $("#csv").bind("change", function (event) {
        parseAndPivot(event.target.files[0]);
    });

});
