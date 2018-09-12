var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "crawlerdb",
    charset: "utf8mb4_general_ci"
});
  
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = "CREATE TABLE IF NOT EXISTS `advertising` (`id` int(11) NOT NULL PRIMARY KEY,`url` text,`title` text,`content` text,`image` text,`info_estate` text,`info_project` text,`name` text,`address` text,`email` text,`phone` text,`area` text,`price` text,`area_size` text) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    connection.query(sql, (err, results, fields) => {
        if (err) throw err;
        //console.log(results);
    });
});

function insert(data){
    connection.query("REPLACE INTO advertising SET ?", data, (err, results, fields) => {
        if (err) {
            console.log("Error at: " + data['url']);
            throw err;
        }
        console.log("Saved: ",data['url']);
    });
}
exports.insert = insert;
exports.connection = () => connection;
