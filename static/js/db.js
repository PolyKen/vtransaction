function read_wish() {
    $.get("/read-wish/buy", function (data) {
        console.log(data);
        console.log(parse_wish_table(data));
    });
    $.get("/read-wish/sell", function (data) {
        console.log(data);
        console.log(parse_wish_table(data));
    });
}

function parse_wish_table(raw_data) {
    let obj_pattern = /{.*?}/g;
    let raw_obj_list = raw_data.match(obj_pattern);
    let obj_list = [];
    for (let i = 0; i < raw_obj_list.length; i++) {
        let raw_obj = raw_obj_list[i];
        let obj = parse_obj(raw_obj);
        console.log(obj);
        obj_list.push(obj);
    }
}

function parse_obj(obj_string) {
    //{'user': 'test_user', 'id': 3, 'price': 3.0, 'time…datetime(2018, 11, 14, 21, 1, 10), 'quantity': 2}
    let user_ptn = /'user': '.*?'/;
    let user = obj_string.match(user_ptn)[0].slice(9, -1);
    console.log("user:", user);
    let id_ptn = /'id': .*?,/;
    let id = obj_string.match(id_ptn)[0].slice(6, -1);
    id = Number(id);
    console.log("id:", id);
    let price_ptn = /'price': .*?,/;
    let price = obj_string.match(price_ptn)[0].slice(9, -1);
    price = Number(price);
    console.log("price:", price);
    let time_ptn = /datetime(.*)/;
    let time = obj_string.match(time_ptn)[0].slice(9, -1);
    console.log("time:", time);
    let quantity_ptn = /'quantity': .*}/;
    let quantity = obj_string.match(quantity_ptn)[0].slice(12, -1);
    quantity = Number(quantity);
    console.log("quantity:", quantity);
}

function read_transaction() {
    $.get("/read-transaction", function (data) {
        console.log(data);
    });
}

function add_wish(user, mode, quantity, price) {
    if (typeof quantity != "string") {
        quantity = quantity.toString();
    }
    if (typeof mode != "string") {
        mode = mode.toString();
    }
    if (typeof price != "string") {
        price = price.toString();
    }
    $.get(
        "/add-wish/" + user + "/" + mode + "/" + quantity + "/" + price,
        function (data) {
            console.log(data);
        }
    );
}