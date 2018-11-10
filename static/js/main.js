$(document).ready(function () {
    $("#buy").on("click", function () {
        $("#sell").prop("checked", false);
    });

    $("#sell").on("click", function () {
        $("#buy").prop("checked", false);
    });

    $("#confirm").on("click", function() {
       let mode = $("#buy").prop("checked");
       let color_class = mode ? "red" : "green";

       if (mode){
           mode = "buy ";
       }
       else{
           mode = "sell ";
       }

       let price = $("#price").val();
       let num = $("#num").val();

       let text = num.toString() + " hand(s), price: ¥" + price.toString();
       if (mode == "buy "){
           add_buy_record(num, price);
       }
       add_log(mode + " " + text, color_class);
    });

    add_log("start");
    draw();
});

function read_table(table_selector){
    let data_set = $(table_selector + " td");
    let table_array = Array();
    for (let i=0;i<data_set.length;i++){
        let temp_array = Array();
        temp_array.push(data_set[i]);
    }
}

function add_buy_record(hand, price){
    let buy_list = $(".buy-list tbody");
    console.log(buy_list);
    buy_list.append("<tr><td>1</td><td>" + hand.toString() + "</td><td>" + price.toString() + "</td></tr>");
}

function add_log(text, color_class="") {
    let selector = $(".logger-text-area");
    selector.append("<p class=\"" + color_class + "\">> " + text + "</p>");
    let height = selector.scrollHeight;
    selector.scrollTop(height);
}

function draw() {
    let canvas = new fabric.Canvas("canv");
    let rect = new fabric.Rect({
        left: 0,
        top: 100,
        fill: 'black', 
        width: 1000,
        height: 3
     });
    canvas.add(rect);
}