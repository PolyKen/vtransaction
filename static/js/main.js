$(document).ready(function () {
    $("#buy").on("click", function () {
        $("#sell").prop("checked", false);
    });

    $("#sell").on("click", function () {
        $("#buy").prop("checked", false);
    });

    $("#confirm").on("click", function () {
        let mode = $("#buy").prop("checked");
        let color_class = mode ? "red" : "green";

        if (mode) {
            mode = "buy ";
        } else {
            mode = "sell ";
        }

        let price = $("#price").val();
        let num = $("#num").val();
        if (price == "" || num == ""){
            alert("Invalid input!");
            return;
        }

        let text = num.toString() + " hand(s), price: ¥" + price.toString();
        if (mode == "buy ") {
            raw_table = read_table(".buy-list tbody");
            raw_table.push(new Array("", num.toString(), price.toString()));
            sorted_table = sort_table(raw_table, 2);
            update_table(".buy-list tbody", sorted_table);
        }
        else{
            raw_table = read_table(".sell-list tbody");
            raw_table.push(new Array("", num.toString(), price.toString()));
            sorted_table = sort_table(raw_table, 2);
            update_table(".sell-list tbody", sorted_table);
        }
        add_log(mode + " " + text, color_class);
    });

    add_log("start");
    draw();
});

function swap(arr, i, j){
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function sort_table(rows, sort_ind) {
    let new_rows = Array();
    let values = Array();
    let indices = Array();
    $.map(rows, function(row, ind){
        values.push(parseFloat(row[sort_ind]));
        indices.push(ind);
    })
    for (let i=0;i<values.length;i++){
        let max = 0;
        let max_ind = 0;
        for (let j=i;j<values.length;j++){
            if (max < values[j]){
                max = values[j];
                max_ind = j;
            }
        }
        swap(indices, i, max_ind);
        swap(values, i, max_ind);
    }
    for (let i=0;i<indices.length;i++){
        new_rows.push(rows[indices[i]]);
    }
    return new_rows;
}

function read_table(table_selector) {
    let raw_rows = $(table_selector).children();
    let rows = Array();
    $.map(raw_rows, function (row) {
        let each_row = Array();
        $.map($(row).children(), function (col) {
            each_row.push($(col).text());
        })
        rows.push(each_row);
    })
    return rows;
}

function update_table(tbody_selector, table_array){
    let tbody = $(tbody_selector);
    tbody.empty();
    for (let i=0;i<table_array.length;i++){
        let each_row = "<tr>";
        each_row += "<td>" + (i+1).toString() + "</td>";
        for (let j=1;j<table_array[i].length;j++){
            each_row += "<td>" + table_array[i][j] + "</td>";
        }
        each_row += "</tr>";
        tbody.append(each_row);
    }
}

function add_log(text, color_class = "") {
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