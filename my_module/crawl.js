var fetch = require("./fetch");
var Crawler = require("crawler");
var fs = require("fs");
//var db = require('./database');
var c = new Crawler({
	maxConnections: 1,
	rateLimit: 1000,
	jQuery: false,
	userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
	callback: function (error, res, done) {
		if (error) {
			console.log(error);
			fs.appendFile('logs/log_error.txt', res.request.uri.href + "\n", function (err) {
				if (err) throw err;
			});
		} else {
			var data = fetch.parseDataContent(res.body);
			if (data != null) {
				data['id'] = res.request.uri.href.match(/\d+$/)[0];
				data['url'] = res.request.uri.href;
				//db.insert(data);
			}
			//console.log("update : "+res.request.uri.href);
		}
		done();
	}
});

//Get all urls in all pages
function crawl_page(url, end_urls, page_id) {
	c.queue([{
		uri: url + "/p" + page_id,
		callback: function (error, res, done) {
			if (error) {
				console.log(error);
			} else {
				let urls = fetch.parseDataUrl(res.body);
				if (urls.length > 0) {
					if (page_id == 1) {
						let path = `logs/first_${url.match(/[^/]+$/)[0]}.txt`;
						fs.writeFile(path, urls.join("\n"), function (err) {
							if (err) throw err;
						});
					}

					let index = urls.findIndex(i => end_urls.includes(i));

					if (index > -1) {
						urls.splice(index);
					} else {
						crawl_page(url, end_urls, page_id + 1);
					}
					if (urls.length) c.queue(urls);
				}
			}
			done();
		}
	}]);
}

function start_crawl(url) {
	let path = `logs/first_${url.match(/[^/]+$/)[0]}.txt`;
	if (fs.existsSync(path)) {
		fs.readFile(path, "utf8", (err, data) => {
			if (err) throw err;
			crawl_page(url, data.trim().split("\n"), 1);
		});
	} else {
		crawl_page(url, [], 1);
	}
}
exports.start_crawl = start_crawl;
