function read_tables() {
    $.get("/read", function(data){
        console.log(data);
    });
}