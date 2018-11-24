function read_wish() {
    $.get("/read-wish/buy", function (data) {
        let buy_wish_table = parse_wish_table(data);
        console.log(buy_wish_table);
        update_wish_table_from_db(".buy-list tbody", buy_wish_table); 
    });
    $.get("/read-wish/sell", function (data) {
        let sell_wish_table = parse_wish_table(data);
        console.log(sell_wish_table);
        update_wish_table_from_db(".sell-list tbody", sell_wish_table); 
    });
}

function parse_wish_table(raw_data) {
    print(raw_data)
    let obj_pattern = /\"(.*?)\"/g;
    let raw_obj_list = raw_data.match(obj_pattern);
    let obj_list = [];
    for (let i = 0; i < raw_obj_list.length; i++) {
        let raw_obj = raw_obj_list[i];
        let obj = parse_obj(raw_obj);
        obj_list.push(obj);
    }
    return obj_list;
}

function parse_obj(obj_string) {
    let obj = Object();
    //{'user': 'test_user', 'id': 3, 'price': 3.0, 'time…datetime(2018, 11, 14, 21, 1, 10), 'quantity': 2}
    let user_ptn = /'user': '.*?'/;
    let user = obj_string.match(user_ptn)[0].slice(9, -1);
    obj.user = user;
    let id_ptn = /'id': .*?[,}]/;
    let id = obj_string.match(id_ptn)[0].slice(6, -1);
    id = Number(id);
    obj.id = id;
    let price_ptn = /'price': .*?[,}]/;
    let price = obj_string.match(price_ptn)[0].slice(9, -1);
    price = Number(price);
    obj.price = price;
    let time_ptn = /datetime(.*)/;
    let time = obj_string.match(time_ptn)[0].slice(9, -1);
    let raw_array = time.match(/\d+[,)]/g);
    let dt_array = [];
    for (let i = 0; i < raw_array.length; i++) {
        t = raw_array[i];
        t = t.slice(0, -1);
        dt_array.push(Number(t));
    }
    obj.time = dt_array;
    let quantity_ptn = /'quantity': .*?[,}]/;
    let quantity = obj_string.match(quantity_ptn)[0].slice(12, -1);
    quantity = Number(quantity);
    obj.quantity = quantity;

    return obj;
}

function read_transaction() {
    $.get("/read-transaction", function (data) {
        let transaction_table = parse_wish_table(data);
        console.log(transaction_table);
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