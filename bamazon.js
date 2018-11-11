var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("connection successful!");
    table();
})

var table = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " || " + res[i].product_name + " || " + res[i].departmen_name + " || " + res[i].price + " || " + res[i].stock_quantity + "\n");
        }
        select(res);
    })
}

var select = function (res) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: "Select item to purchase"
    }]).then(function (answer) {
        var correct = false;
        for (var i = 0; i < res.length; i++) {
            correct = true;
            var product = answer.choice;
            var id = i;
            inquirer.prompt({
                type: "input",
                name: "quantity",
                message: "How many items would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) == false) {
                        return true
                    } else {
                        return false;
                    }
                }
            }).then(function (answer) {
                if ((res[id].stock_quantity - answer.quantity) > 0) {
                    connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - answer.quantity) + "' WHERE product_name ='" + product + "'", function(err, res2){
                        console.log("Purchase Complete");
                        table();
                    })
                }
                else {
                    console.log("Invalid Action");
                    process.end();
                }
            })
        }
    })
}