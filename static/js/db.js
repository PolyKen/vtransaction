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
    return JSON.parse(raw_data);
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