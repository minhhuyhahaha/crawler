const fetch = require("./fetch");
const Crawler = require("crawler");
const fs = require("fs");
const db = require('./database');
const userAgentArray = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
				"Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9",
				"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36",
				"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1",
				"Mozilla/5.0 (X11; U; CrOS i686 0.9.130; en-US) AppleWebKit/534.10 (KHTML, like Gecko) Chrome/8.0.552.344 Safari/534.10",
				"Mozilla/5.0 (Windows NT 5.1) Gecko/20100101 Firefox/14.0 Opera/12.0",
				"Mozilla/5.0 (Windows NT 5.1; U; en; rv:1.8.1) Gecko/20061208 Firefox/5.0 Opera 11.11",
				"Mozilla/5.0 (Windows NT 6.0; rv:2.0) Gecko/20100101 Firefox/4.0 Opera 12.14",
				"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0) Opera 12.14",
				"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; de) Opera 11.51",
				"Opera/12.0(Windows NT 5.1;U;en)Presto/22.9.168 Version/12.00",
				"Opera/12.0(Windows NT 5.2;U;en)Presto/22.9.168 Version/12.00",
				"Opera/12.80 (Windows NT 5.1; U; en) Presto/2.10.289 Version/12.02",
				"Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; de) Presto/2.9.168 Version/11.52",
				"Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52",
				"Opera/9.80 (Windows NT 5.1; U; cs) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (Windows NT 5.1; U; en) Presto/2.9.168 Version/11.51",
				"Opera/9.80 (Windows NT 5.1; U; zh-sg) Presto/2.9.181 Version/12.00",
				"Opera/9.80 (Windows NT 5.1; U; zh-tw) Presto/2.8.131 Version/11.10",
				"Opera/9.80 (Windows NT 5.1; U;) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (Windows NT 5.2; U; ru) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14",
				"Opera/9.80 (Windows NT 6.0; U; en) Presto/2.8.99 Version/11.10",
				"Opera/9.80 (Windows NT 6.0; U; pl) Presto/2.10.229 Version/11.62",
				"Opera/9.80 (Windows NT 6.0; U; pl) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (Windows NT 6.1; Opera Tablet/15165; U; en) Presto/2.8.149 Version/11.1",
				"Opera/9.80 (Windows NT 6.1; U; cs) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (Windows NT 6.1; U; en-US) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (Windows NT 6.1; U; es-ES) Presto/2.9.181 Version/12.00",
				"Opera/9.80 (Windows NT 6.1; U; sv) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (Windows NT 6.1; U; zh-cn) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (Windows NT 6.1; U; zh-tw) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (Windows NT 6.1; WOW64; U; pt) Presto/2.10.229 Version/11.62",
				"Opera/9.80 (X11; Linux i686; U; es-ES) Presto/2.8.131 Version/11.11",
				"Opera/9.80 (X11; Linux i686; U; fr) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (X11; Linux i686; U; hu) Presto/2.9.168 Version/11.50",
				"Opera/9.80 (X11; Linux i686; U; ja) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (X11; Linux i686; U; ru) Presto/2.8.131 Version/11.11",
				"Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16",
				"Opera/9.80 (X11; Linux x86_64; U; Ubuntu/10.10 (maverick); pl) Presto/2.7.62 Version/11.01",
				"Opera/9.80 (X11; Linux x86_64; U; bg) Presto/2.8.131 Version/11.10",
				"Opera/9.80 (X11; Linux x86_64; U; fr) Presto/2.9.168 Version/11.50"
]
const c = new Crawler({
	maxConnections: 10,
	retryTimeout: 120000,
	jQuery: false,
	rotateUA: true,
	userAgent: userAgentArray,
	callback: (error, res, done) => {
		if (error) {
			console.log(error);
			fs.appendFile('logs/log_error.txt', res.request.uri.href + "\n", function (err) {
				if (err) throw err;
			});
		} else {
			let data = fetch.parseDataContent(res.body);
			if (data != null) {
				data['id'] = res.request.uri.href.match(/\d+$/)[0];
				data['url'] = res.request.uri.href;
				db.insert(data);
			}
			//console.log("update : "+res.request.uri.href);
		}
		done();
	}
});

const page_crawler = new Crawler({
	rateLimit: 5000,
	retryTimeout: 120000,
	jQuery: false,
	rotateUA: true,
	userAgent: userAgentArray,
	callback: (error, res, done) => {
		if (error) {
			console.log(error);
		} else {
			let urls = fetch.parseDataUrl(res.body);
			if (urls.length > 0) {
				if (res.options.page_id == 1) {
					let path = `logs/first_${res.options.root_url.match(/[^/]+$/)[0]}.txt`;
					fs.writeFile(path, urls.join("\n"), function (err) {
						if (err) throw err;
					});
				}

				let index = urls.findIndex(i => res.options.end_urls.includes(i));

				if (index > -1) {
					urls.splice(index);
				} else {
					page_crawler.queue([{
						uri: res.options.root_url + "/p" + (res.options.page_id + 1),
						root_url: res.options.root_url,
						end_urls: res.options.end_urls,
						page_id: res.options.page_id + 1
					}]);
				}
				if (urls.length) c.queue(urls);
			}
		}
		done();
	}
});


//Get all urls in all pages
function crawl_page(root_url, end_urls, page_id) {
	page_crawler.queue([{
		uri: root_url + "/p" + page_id,
		root_url: root_url,
		end_urls: end_urls,
		page_id: page_id
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
