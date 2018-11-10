$(document).ready(function () {
    $("#buy").click(function () {
        $("#sell").prop("checked", false);
    });

    $("#sell").click(function () {
        $("#buy").prop("checked", false);
    });

    $("#confirm").click(function() {
       let mode = $("#buy").prop("checked");
       if (mode){
           mode = "buy ";
       }
       else{
           mode = "sell ";
       }

       let price = $("#price").val();
       let num = $("#num").val();

       add_log(mode + " " + num.toString() + " " + price.toString());
    });

    add_log("start");
    draw();
})

function add_log(text) {
    $(".logger-text-area").append("<p>> "+text+"</p>");
    let height = $(".logger-text-area")[0].scrollHeight;
    $(".logger-text-area").scrollTop(height);
}

function draw() {
    var canvas = new fabric.Canvas("canv");
    var rect = new fabric.Rect({
        left: 0,
        top: 100,
        fill: 'black', 
        width: 1000,
        height: 3
     });
    canvas.add(rect);
}