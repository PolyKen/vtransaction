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

        let text = num.toString() + " hand(s), price: ¥" + price.toString();
        if (mode == "buy ") {
            raw_table = read_table(".buy-list tbody");
            raw_table.push(new Array("", num.toString(), price.toString()));
            sorted_table = sort_table(raw_table, 2);
            update_table(".buy-list tbody", sorted_table);
        } else {
            raw_table = read_table(".sell-list tbody");
            raw_table.push(new Array("", num.toString(), price.toString()));
            sorted_table = sort_table(raw_table, 2);
            update_table(".sell-list tbody", sorted_table);
        }

        add_log(mode + " " + text, color_class);
        let canvas = update_canvas();
        update_bid_on_canvas(canvas, read_table(".buy-list tbody"), 'red');
        update_bid_on_canvas(canvas, read_table(".sell-list tbody"), 'green');
    });
});

const INF = 999999999;
var start_price = INF;
var start_pos = 0;
var end_price = 0;
var end_pos = 0;

function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function sort_table(rows, sort_ind) {
    let new_rows = Array();
    let values = Array();
    let indices = Array();
    $.map(rows, function (row, ind) {
        values.push(parseFloat(row[sort_ind]));
        indices.push(ind);
    })
    for (let i = 0; i < values.length; i++) {
        let max = 0;
        let max_ind = 0;
        for (let j = i; j < values.length; j++) {
            if (max < values[j]) {
                max = values[j];
                max_ind = j;
            }
        }
        swap(indices, i, max_ind);
        swap(values, i, max_ind);
    }
    for (let i = 0; i < indices.length; i++) {
        new_rows.push(rows[indices[i]]);
    }

    if (start_price > parseFloat(new_rows[new_rows.length - 1][2])) {
        start_price = parseFloat(new_rows[new_rows.length - 1][2]);
        start_price = Math.round(start_price);
    }
    if (end_price < parseFloat(new_rows[0][2])) {
        end_price = parseFloat(new_rows[0][2]);
        end_price = Math.round(end_price);
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
    }
}