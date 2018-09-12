var crawl = require("./my_module/crawl");
crawl.start_crawl("https://batdongsan.com.vn/nha-dat-ban");
crawl.start_crawl("https://batdongsan.com.vn/nha-dat-cho-thue");


// var express = require("express");
// var app = express();
// var db = require('./my_module/database');
// app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//     db.connection().query("SELECT * FROM advertising ", (err, results, fields) => {
//         if (err) throw err;
//         res.render('index', {
//             results: results
//         });
//     });
// });

// app.use('/', express.static('./sources'));

// app.listen(process.env.PORT || 8080);