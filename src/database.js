const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

DatabaseHandler = class DatabaseHandler {

  constructor(db_file_name) {
    this.ids = {
      cake: 1,
      customer: 1,
      order: 1
    }

    fs.exists(db_file_name, (exists) => {
      if (!exists) {

        this.db = new sqlite3.Database(db_file_name);
        this.db.serialize(() => {
          this.initDatabase()
        });

        this.db.parallelize(() => {
          this.insertCakes()
          this.insertCustomers()
          this.insertOrders()
        })
      }
      this.db = new sqlite3.Database(db_file_name);
    })
  }

  initDatabase() {
    this.db.run("CREATE TABLE cakes (id INT not NULL, name TEXT, price REAL, picture BLOOB)");
    this.db.run("CREATE TABLE customers (id INT, name TEXT, tel_number TEXT, email TEXT, address TEXT)");
    this.db.run("CREATE TABLE orders (id INT, customer_id INT, cake_id INT)");
  }

  insertCakes() {
    this.db.serialize(() => {
      this.insertCake("Ciocolata belgiana", 45, "belgian.jpg");
      this.insertCake("Tort de ciocolata vegan", 130, "vegan.jpg");
      this.insertCake("Macarons", 18, "maca.jpg");
      this.insertCake("French Kiss", 85, "french.jpg");
      this.insertCake("Tort cifre", 115, "cifra.jpg");
      this.insertCake("Cheesecake cu mure", 70, "cheesecake.jpg");
    })
  }

  insertCustomers() {
    this.insertCustomer("Customer1", "tel_nr1", "email1", "address1");
    this.insertCustomer("Customer2", "tel_nr2", "email2", "address2");
    this.insertCustomer("Customer3", "tel_nr3", "email3", "address3");
  }

  insertOrders() {
    this.insertOrder(1, 1, 1);
    this.insertOrder(2, 2, 2);
    this.insertOrder(3, 3, 3);
  }

  getPicture(name, callback) {
    fs.readFile(path.join("src/public", name), (err, data) => {
      if (err) return
      let pict = 'data:image/jpeg;base64,' + data.toString('base64');
      callback(pict)
    })
  }

  insertCake(name, price, picture) {
    this.getPicture(picture, (pict) => {
      let index = this.ids.cake;
      var stmt = this.db.prepare("INSERT INTO cakes VALUES (?,?,?,?);");
      stmt.run(index, name, price, pict);
      stmt.finalize()
      this.ids.cake += 1;
    })
  }

  insertCustomer(name, tel, email, address) {
    let index = this.ids.customer;
    var stmt = this.db.prepare("INSERT INTO customers VALUES (?,?,?,?,?)");
    stmt.run(index, name, tel, email, address);
    stmt.finalize()
    this.ids.customer += 1;
  }

  insertOrder(customer_id, cake_id) {
    let index = this.ids.order;
    var stmt = this.db.prepare("INSERT INTO orders VALUES (?,?,?)");
    stmt.run(index, customer_id, cake_id);
    stmt.finalize();
    this.ids.order += 1;
  }

  getCakes(callback) {
    this.getResult("SELECT * FROM cakes", (err, rows) => {
      if (err < 0) {
        callback(-1, "DB error!")
        return;
      }
      callback(0, rows)
    })
  }

  getCakesForOrder(callback) {
    this.getResult("SELECT name FROM cakes", (err, row) => {
      if (err < 0) {
        callback(-1, "DB error!")
        return;
      }
      callback(0, row)
    })
  }

  getResult(command, callback) {
    this.db.serialize(() => {
      this.db.all(command, (err, allRows) => {
        if (err != null) {
          callback(-1, err);
        }
        callback(0, allRows);
      })
    });
  }

  deleteProduct(cake_id, callback) {
    let sql = "DELETE FROM cakes WHERE id=" + cake_id;
    this.db.run(sql, function(err) {
      if (err) {
        console.error(err.message);
        callback(err, null)
      }
      callback(null, "OK")
    });
  }
}
/*
  getID(table) {
    let sql = "SELECT MAX(id) AS ID FROM " + table;
    this.db.get(sql, (err,row) => {
      if(err) {
        return 0;
      }
      else return row.ID;
    })
  }

  getCakeID(cake_name) {
    let sql = "SELECT id FROM cakes WHERE name=" + cake_name;
    this.db.get(sql, (err,row) => {
      if(err) {
        return 0;
      }
      else return row.ID;
    })
  }
*/
module.exports.DatabaseHandler = DatabaseHandler
