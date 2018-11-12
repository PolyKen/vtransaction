$(document).ready(function () {
    add_log("start");
    update_canvas();

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
        if (price == "" || num == "") {
            alert("Invalid input!");
            return;
        }

        let text = num + " hand(s), price: ¥" + price;
        add_log(mode + " " + text, color_class);
        num = parseInt(num);
        price = parseFloat(price);

        if (mode == "buy ") {
            buy_table.push(new Array("", num, price));
            sort(buy_table, 2, "decline");
            update_table(".buy-list tbody", buy_table);
        } else {
            sell_table.push(new Array("", num, price));
            sort(sell_table, 2, "rise");
            update_table(".sell-list tbody", sell_table);
        }

        let canvas = update_canvas();
        update_bid_on_canvas(canvas, buy_table, 'red');
        update_bid_on_canvas(canvas, sell_table, 'green');
    });
});

const INF = 999999999;
var start_price = INF;
var start_pos = 0;
var end_price = 0;
var end_pos = 0;

var buy_table = Array();
var sell_table = Array();

function sort(table, sort_ind, order) {
    if (order == "decline"){
        for (let i = 0; i < table.length; i++) {
            let max_value = -INF, max_ind = i;
            for (let j = i; j < table.length; j++){
                if (max_value < table[j][sort_ind]) {
                    max_value = table[j][sort_ind];
                    max_ind = j;
                }
            }
            let temp1 = table[i][1], temp2 = table[i][2];
            table[i][1] = table[max_ind][1];
            table[i][2] = table[max_ind][2];
            table[max_ind][1] = temp1;
            table[max_ind][2] = temp2;
        }
    }

    if (order == "rise"){
        for (let i = 0; i < table.length; i++) {
            let min_value = INF, min_ind = i;
            for (let j = i; j < table.length; j++){
                if (min_value > table[j][sort_ind]) {
                    min_value = table[j][sort_ind];
                    min_ind = j;
                }
            }
            let temp1 = table[i][1], temp2 = table[i][2];
            table[i][1] = table[min_ind][1];
            table[i][2] = table[min_ind][2];
            table[min_ind][1] = temp1;
            table[min_ind][2] = temp2;
        }
    }
}

function update_table(tbody_selector, table_array) {
    let tbody = $(tbody_selector);
    tbody.empty();
    for (let i = 0; i < table_array.length; i++) {
        let each_row = "<tr>";
        each_row += "<td>" + (i + 1).toString() + "</td>";
        for (let j = 1; j < table_array[i].length; j++) {
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

function add_scale(x_pos, base_height, length, color = 'black') {
    let scale_line = new fabric.Rect({
        left: x_pos,
        top: base_height - length,
        fill: color,
        width: 2,
        height: length * 2 + 2,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockScalingFlip: true,
        lockSkewing: true
    });
    return scale_line;
}

function add_triangle(x_pos, base_height, color) {
    let tri = new fabric.Triangle({
        width: 10, height: 7.5, fill: color, left: x_pos - 4, top: base_height
    });
    return tri; 
}

function add_scale_text(text, size, x_pos, y_pos) {
    let scale_text = new fabric.Text(text, {
        left: x_pos,
        top: y_pos,
        hasControls: false,
        fill: 'black',
        fontSize: size,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockScalingFlip: true,
        lockSkewing: true
    });
    return scale_text;
}

function draw_scale(canvas, base_width, base_height, scale_length = 8, scale_num = 10) {
    let space = base_width / (scale_num + 1);
    let price_space = (end_price - start_price) / scale_num;
    if (start_price == INF) {
        return;
    }
    if (price_space == 0) {
        scale_num = 0;
        space = base_width;
    }
    start_pos = space / 2;
    for (let i = 0; i < scale_num + 1; i++) {
        let pos = start_pos + i * space;
        end_pos = pos;
        canvas.add(add_scale(pos, base_height, scale_length));
        let price = Math.round((start_price + price_space * i) * 100) / 100;
        canvas.add(add_scale_text(price.toString(), 16, pos - 3, base_height - scale_length - 18));
    }
}

function update_canvas() {
    $("#canv").empty();
    return draw();
}

function draw() {
    /* init base line */
    let width = $("#jumbotron-canv").css("width");
    let height = $("#jumbotron-canv").css("height");
    width = width.slice(0, -2);
    height = height.slice(0, -2);
    $("#canv").prop("width", width);
    $("#canv").prop("height", height);
    let base_height = parseInt(height) / 2;
    let base_width = parseInt(width) - 20;

    let canvas = new fabric.Canvas("canv");

    let rect = new fabric.Rect({
        left: 0,
        top: base_height,
        fill: 'black',
        width: base_width,
        height: 2,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockScalingFlip: true,
        lockSkewing: true
    });
    canvas.add(rect);

    /* draw scale */
    draw_scale(canvas, base_width, base_height, scale_length = 6, scale_num = 10);
    return canvas;
}

function update_bid_on_canvas(canvas, table, color) {
    if (start_price > end_price) {
        return;
    }
    let height = $("#jumbotron-canv").css("height");
    height = height.slice(0, -2);
    let base_height = parseInt(height) / 2;

    for (let i = 0; i < table.length; i++) {
        let row = table[i];
        let hand = row[1];
        let price = row[2];
        let pos;
        if (start_pos < end_pos) {
            pos = start_pos + (end_pos - start_pos) * (price - start_price) / (end_price - start_price);
        }
        else{
            pos = (start_pos + end_pos) / 2;
        }
        canvas.add(add_triangle(pos, base_height + 5, color));
        canvas.add(add_scale_text(hand.toString() + "手", 14, pos - 3, base_height + 20, color));
        canvas.add(add_scale_text(price.toString() + "元", 14, pos - 3, base_height + 40, color));
    }
}