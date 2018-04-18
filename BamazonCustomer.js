// Required npm packages for this project
var mysql = require('mysql');
var inquirer = require('inquirer');

// Create a SQl connection via node using server and daatabase credentials created in mySQL
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

// Connect to the database and create a function that runs the "displayProducts()" function which contains all the products organized in a table
connection.connect(function(err) {
    if (err) throw err;
    displayProducts();
})

// * --  Display All of the Items available for sale. This initial display, should include the ids, names, and prices of products for sale --
var displayProducts = function() {
  var query = 'SELECT * FROM Products'
  connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
          console.log("Item ID: " + res[i].itemID + " || Product: " + res[i].productName + " || Department: " + res[i].productDepartment + " || Price: " + res[i].price + " || Stock: " + res[i].stockQuantity);
      }
      shoppingCart();
    })
};
// * -- Users should then be prompted with two messages:
//        -- The first message should ask them the ID of the product they would like to buy    --
//        -- The second message should ask them how many of the product they would like to buy --
var shoppingCart = function() {
    inquirer.prompt([{
        name: "ProductID",
        type: "input",
        message: "What is the ID of the product you would like to buy?",
        //Validate: checks weather or not the user typed a response
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "Quantity",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {

      // * -- Once the customer has placed the order: Your application should...
          // * Check if your store has enough quantity of the product to meet the customer's request.
          //   If not, you should respond to the user by saying: "Insufficient quantity" and prevent the order from going through.
          // * If your store DOES have enough of the product to meet the customer's request, you should fulfill their order.
          //   This means that you should show them the total cost of their puchase. Then update the SQL database to reflect the remaining quantity. --
        var query = 'SELECT * FROM Products WHERE itemID=' + answer.Quantity;
        connection.query(query, function(err, res) {
          if (answer.Quantity <= res) {
            for (var i = 0; i < res.length; i++) {
                console.log("We currently have " + res[i].stockQuantity + " " + res[i].productName + ".");
                console.log("Thank you for your patronage! Your order of "+ res[i].stockQuantity + " " + res[i].productName + " is now being processed.");
              }
            } else {
              console.log("Not enough of this product in stock.");
            }
            displayProducts();
        })
    })
};