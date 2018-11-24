function read_wish() {
    $.get("/read-wish/buy", function(data){
        console.log(data);
        console.log(parse_wish_table(data));
    });
    $.get("/read-wish/sell", function(data){
        console.log(data);
        console.log(parse_wish_table(data));
    });
}

function parse_wish_table(raw_data) {
    let obj_pattern = /{.*}/g;
    let raw_obj_list = raw_data.match(obj_pattern);
    console.log(raw_obj_list);
    let obj_list = new Array();
    for (let i=0;i<raw_obj_list.length;i++){
        let raw_obj = raw_obj_list[i];
        let obj = parse_obj(raw_obj);
        console.log(obj);
        obj_list.push(obj);
    }
}

function parse_obj(obj_string) {
    let field_pattern = /'.*?'/g;
}

function read_transaction() {
    $.get("/read-transaction", function(data){
        console.log(data);
    })
}

function add_wish(user, mode, quantity, price) {
    if (typeof(quantity) != "string") {
        quantity = quantity.toString();
    }
    if (typeof(mode) != "string") {
        mode = mode.toString();
    }
    if (typeof(price) != "string") {
        price = price.toString();
    }
    $.get("/add-wish/" + user + '/' + mode + '/' + quantity + '/' + price, function(data) {
        console.log(data);
    });
}