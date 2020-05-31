// Imports
const express = require("express");
const bodyParser = require('body-parser');
const upload = require("express-fileupload");
const fs = require('fs');
const ejs = require('ejs');

const DatabaseHandler = require('./src/database').DatabaseHandler;

// Static viariables
const port = 3000;
var db_file_name = "bakery_database.db";

// Application setup
var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(upload());

app.set('view engine', 'html');
app.set('views', __dirname + '/src/views');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/src/public'));

//init database
let databaseHandler = new DatabaseHandler(db_file_name);

// Routes
app.get("/favicon.ico", (request, response, next) => {
  response.sendFile("favicon.ico")
});

app.get("/", (request, response, next) => {
  response.render("main.html")
});

app.get("/about", (request, response, next) => {
  response.render("about.html")
});

app.get("/products", (request, response, next) => {
  databaseHandler.getCakes((err, ret_value) => {
    if (err < 0) {
      response.send(ret_value)
      return;
    }
    response.render("products.html", { db_info: ret_value })
  })
});

app.post("/products", (request, response) => {
  var info = request.body
  var file = request.files.fileToUpload
  var filename = file.name

  // save file to disk
  file.mv("src/public/" + filename)

  // insert file into db
  databaseHandler.insertCake(info.product_name, info.product_price, filename)

  // delete file from disk
  fs.unlink("src/public/" + filename, err => {
    if (err) console.log(err);
  });

  // reload get page
  response.redirect("/products")
});

app.post("/products/delete", (request, response) => {
  var info = request.body.prod_id
  databaseHandler.deleteProduct(info, (err, db_resp) => {
    if (err) {
        response.send("DB Error!");
    } else {
      response.send("Deleted!");
    }
  })
});

app.get("/order", (request, response, next) => {
  response.render("order.html")
});

app.get("/order", (request, response, next) => {
  databaseHandler.getCakes((err, ret_value) => {
    if (err < 0) {
      response.send(ret_value)
      return;
    }
    response.render("order.html", { db_info: ret_value })
  })
});

app.get("/contact", (request, response, next) => {
  response.render("contact.html")
});

// Start app
app.listen(port, () => {
  console.log("Listenning on " + port);
});
