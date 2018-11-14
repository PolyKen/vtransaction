function read_wish() {
    $.get("/read-wish", function(data){
        console.log(data);
        let p = JSON.parse(data);
        console.log(p);
    });
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