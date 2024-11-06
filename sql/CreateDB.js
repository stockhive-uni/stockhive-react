function CreateDB() {
    const mysql = require('mysql');
    const util = require('util');

    const con = mysql.createConnection({
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: ""
    });

    con.query = util.promisify(con.query);
    con.connect = util.promisify(con.connect);
    con.changeUser = util.promisify(con.changeUser);

    async function createTables() {
    try {
        // Connect to database
        await con.connect();
        console.log("Connected!");

        // Create database
        await con.query("CREATE DATABASE If Not Exists stock_hive", function (err, result) {

            // If the database is created, it will affect rows and return more than 1 affected row
            if (result.affectedRows > 0) {
                console.log("Database created");

                // Change connection to database
                con.changeUser({ database: 'stock_hive' });
        
                // Define SQL queries for each table
                const tableQueries = [
                    `CREATE TABLE If Not Exists store (
                        store_id int NOT NULL AUTO_INCREMENT,
                        location text NOT NULL,
                        postcode text NOT NULL,
                        PRIMARY KEY (store_id ASC)
                    )`,
                    `CREATE TABLE If Not Exists employee (
                        employee_id int NOT NULL AUTO_INCREMENT,
                        store_id int NOT NULL,
                        first_name varchar(50) NOT NULL,
                        last_name varchar(50) NOT NULL,
                        access int NOT NULL,
                        PRIMARY KEY (employee_id ASC),
                        FOREIGN KEY (store_id) REFERENCES store (store_id)
                    )`,
                    `CREATE TABLE If Not Exists purchase_order (
                        purchase_order_id int NOT NULL AUTO_INCREMENT,
                        employee_id int NOT NULL,
                        store_id int NOT NULL,
                        date datetime NOT NULL,
                        PRIMARY KEY (purchase_order_id ASC),
                        FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
                        FOREIGN KEY (store_id) REFERENCES store (store_id)
                    )`,
                    `CREATE TABLE If Not Exists department (
                        department_id int NOT NULL AUTO_INCREMENT,
                        name text NOT NULL,
                        PRIMARY KEY (department_id ASC)
                    )`,
                    `CREATE TABLE If Not Exists item (
                        item_id int NOT NULL AUTO_INCREMENT,
                        name text NOT NULL,
                        price float NOT NULL,
                        department_id int NOT NULL,
                        orderLimit int NOT NULL,
                        PRIMARY KEY (item_id ASC),
                        FOREIGN KEY (department_id) REFERENCES department (department_id)
                    )`,
                    `CREATE TABLE If Not Exists purchase_order_item (
                        purchase_order_id int NOT NULL,
                        item_id int NOT NULL,
                        ordered int NOT NULL,
                        delivered int NOT NULL,
                        price float NOT NULL,
                        FOREIGN KEY (purchase_order_id) REFERENCES purchase_order (purchase_order_id),
                        FOREIGN KEY (item_id) REFERENCES item (item_id)
                    )`,
                    `CREATE TABLE If Not Exists store_item (
                        store_item_id int NOT NULL AUTO_INCREMENT,
                        store_id int NOT NULL,
                        item_id int NOT NULL,
                        price float NOT NULL,
                        PRIMARY KEY (store_item_id ASC),
                        FOREIGN KEY (store_id) REFERENCES store (store_id)
                    )`,
                    `CREATE TABLE If Not Exists location (
                        location_id int NOT NULL AUTO_INCREMENT,
                        name text NOT NULL,
                        PRIMARY KEY (location_id ASC)
                    )`,
                    `CREATE TABLE If Not Exists store_item_storage (
                        store_item_id int NOT NULL,
                        quantity int NOT NULL,
                        location_id int NOT NULL,
                        FOREIGN KEY (store_item_id) REFERENCES store_item (store_item_id),
                        FOREIGN KEY (location_id) REFERENCES location (location_id)
                    )`,
                    `CREATE TABLE If Not Exists transaction (
                        transaction_id int NOT NULL AUTO_INCREMENT,
                        employee_id int NOT NULL,
                        store_id int NOT NULL,
                        date datetime NOT NULL,
                        card text NOT NULL,
                        PRIMARY KEY (transaction_id ASC),
                        FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
                        FOREIGN KEY (store_id) REFERENCES store (store_id)
                    )`,
                    `CREATE TABLE If Not Exists transaction_item (
                        transaction_id int NOT NULL,
                        item_id int NOT NULL,
                        quantity int NOT NULL,
                        price float NOT NULL,
                        FOREIGN KEY (transaction_id) REFERENCES transaction (transaction_id),
                        FOREIGN KEY (item_id) REFERENCES item (item_id)
                    )`,
                    `CREATE TABLE If Not Exists over_deliveries (
                        purchase_order_id int NOT NULL,
                        item_id int NOT NULL,
                        employee_id int NOT NULL,
                        store_id int NOT NULL,
                        returned int NOT NULL,
                        quantity int NOT NULL,
                        date datetime NOT NULL,
                        FOREIGN KEY (purchase_order_id) REFERENCES purchase_order (purchase_order_id),
                        FOREIGN KEY (item_id) REFERENCES item (item_id),
                        FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
                        FOREIGN KEY (store_id) REFERENCES store (store_id)
                    )`,
                    `CREATE TABLE If Not Exists store_item_price_change (
                        store_item_id int NOT NULL,
                        employee_id int NOT NULL,
                        old_price float NOT NULL,
                        new_price float NOT NULL,
                        FOREIGN KEY (store_item_id) REFERENCES store_item (store_item_id),
                        FOREIGN KEY (employee_id) REFERENCES employee (employee_id)
                    )`,
                    `CREATE TABLE If Not Exists store_item_location_change (
                        store_item_id int NOT NULL,
                        employee_id int NOT NULL,
                        old_location_id int NOT NULL,
                        new_location_id int NOT NULL,
                        FOREIGN KEY (store_item_id) REFERENCES store_item (store_item_id),
                        FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
                        FOREIGN KEY (old_location_id) REFERENCES location (location_id),
                        FOREIGN KEY (new_location_id) REFERENCES location (location_id)
                    )`,
                    `INSERT INTO store (location, postcode) VALUES
                    ('Sheffield', 'S11 1AA')
                    `,
                    `INSERT INTO employee (employee_id, store_id, first_name, last_name, access) VALUES
                    (1, 1, 'Test', 'User', 1111)
                    `,
                    `INSERT INTO purchase_order (purchase_order_id, employee_id, store_id, date) VALUES
                    (1, 1, 1, NOW())
                    `,
                    `INSERT INTO department (department_id, name) VALUES
                    (1, 'Clothing'),
                    (2, 'Toys'),
                    (3, 'Food')
                    `,
                    `INSERT INTO item (item_id, name, price, department_id, orderLimit) VALUES
                    (1, 'Shirt', 9.99, 1, 15),
                    (2, 'Fortnite Nerf Gun', 299.99, 2, 5),
                    (3, 'Spam', 2.99, 3, 25)
                    `,
                    `INSERT INTO purchase_order_item (purchase_order_id, item_id, ordered, delivered, price) VALUES
                    (1, 1, 15, 5, 8.99),
                    (1, 2, 4, 0, 299.99),
                    (1, 3, 20, 20, 2.99)
                    `,
                    `INSERT INTO store_item (store_item_id, store_id, item_id, price) VALUES
                    (1, 1, 1, 10.99),
                    (2, 1, 2, 319.99),
                    (3, 1, 3, 3.49)
                    `,
                    `INSERT INTO location (location_id, name) VALUES
                    (1, 'Back stock'),
                    (2, 'Shelves'),
                    (3, 'Freezer'),
                    (4, 'Chiller')
                    `,
                    `INSERT INTO store_item_storage (store_item_id, quantity, location_id) VALUES
                    (1, 20, 2),
                    (1, 10, 1),
                    (2, 4, 2),
                    (3, 25, 2),
                    (3, 10, 1)
                    `
                ];
        
                // Create tables
                for (let sql of tableQueries) {
                con.query(sql);
                }
                console.log("Tables created and data entered");
        
                // Get all stores
                var result = con.query("SELECT * FROM store");
                console.log(result.length ? result : "No data found");
        
                // Get all employees
                result = con.query("SELECT * FROM employee");
                console.log(result.length ? result : "No data found");
            }
            else {
                console.log("Database already created");
            }
        });
    } catch (err) {
        console.error("Error:", err);
    }
    con.end();
    }

    createTables();
}

export default CreateDB;