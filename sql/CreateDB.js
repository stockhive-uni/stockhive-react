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
    console.log("dunno");
    try {
        // Connect to database
        await con.connect();
        console.log("Connected!");

        // Create database
        await con.query("CREATE DATABASE IF NOT EXISTS stock_hive");
        console.log("Database created");

        // Change connection to database
        await con.changeUser({ database: 'stock_hive' });

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
            firstName varchar(50) NOT NULL,
            lastName varchar(50) NOT NULL,
            email varchar(50) NOT NULL,
            password varchar(255) NOT NULL,
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
            price int NOT NULL,
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
            price int NOT NULL,
            FOREIGN KEY (purchase_order_id) REFERENCES purchase_order (purchase_order_id),
            FOREIGN KEY (item_id) REFERENCES item (item_id)
        )`,
        `CREATE TABLE If Not Exists store_item (
            store_item_id int NOT NULL AUTO_INCREMENT,
            store_id int NOT NULL,
            item_id int NOT NULL,
            price int NOT NULL,
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
            price int NOT NULL,
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
            old_price int NOT NULL,
            new_price int NOT NULL,
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
        )`
        ];

        // Create tables
        for (let sql of tableQueries) {
        await con.query(sql);
        }
        console.log("Tables created");

        // Insert test data
        await con.query("INSERT INTO store (location, postcode) VALUES ('Sheffield', 'S11 1AA')");
        console.log("Inserted data");

        // Get all stores
        const result = await con.query("SELECT * FROM store");
        console.log(result.length ? result : "No data found");

    } catch (err) {
        console.error("Error:", err);
    }
    con.end();
    }

    createTables();
}

export default CreateDB;