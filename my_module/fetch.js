const cheerio = require('cheerio')
function parseDataContent(data) {
	var $ = cheerio.load(data, {
		decodeEntities: false
	});
	var field = {};
	try {
		//Tieu de
		field['title'] = $(".pm-title").text().trim();
		//Khai quat chi tiet
		x = $("#product-detail > div.kqchitiet");
		if (x) {
			var a = x.text().match(/Khu vực:(.*)\n*Giá:\n*(.*)\n*Diện tích:\n*(.*)/);
			field['area'] = a[1].trim();
			field['price'] = a[2].trim();
			field['area_size'] = a[3].trim();
		}
		//Noi dung
		field['content'] = $(".pm-desc,.pm-content.stat").html().replace(/<a [^>]*>([^<]*)<\/a>/g, '$1').trim();
		//Hinh thu nho
		x = $("#thumbs");
		field['image'] = x ? JSON.stringify(x.children().map((i, e) => $(e).children().first().attr("src").replace('200x200', '745x510')).get()) : null;
		//Dac diem bat dong san
		x = $(".div-hold > .table-detail");
		field['info_estate'] = x ? '[' + x.children().map((i, e) => JSON.stringify([$(e).children().eq(0).text().trim(), $(e).children().eq(1).text().trim()])).get().join() + ']' : null;
		//Thong tin du an
		x = $("#project > .table-detail");
		field['info_project'] = x ? '[' + x.children().map((i, e) => JSON.stringify([$(e).children().eq(0).text().trim(), $(e).children().eq(1).text().trim()])).get().join() + ']' : null;
		//Thong tin lien he
		x = $("#divCustomerInfo,#divCustomerInfoAd");
		if (x) {
			x.children().each(function (i, e) {
				if ($(e).children().length > 1)
					switch ($(e).children().first().text().trim()) {
						case "Email": field['email'] = $(e).children().eq(1).html().replace(/[^]*>(.*)<\/a>[^]*/, '$1').split(/[^\d]+/).map(i => i != '' ? String.fromCharCode(i) : "").join(""); break;
						case "Tên liên lạc": field['name'] = $(e).children().eq(1).text().trim(); break;
						case "Mobile": case "Điện thoại": field['phone'] = $(e).children().eq(1).text().trim(); break;
						case "Địa chỉ": field['address'] = $(e).children().eq(1).text().trim(); break;
					}
			});
		}
	} catch (e) {
		console.log(e);
		return null;
	}
	return field;
}
function parseDataUrl(data) {
	var $ = cheerio.load(data, {
		decodeEntities: false
	});
	var x = $(".p-title a");
	if (x) {
		return x.map((i, e) => "https://batdongsan.com.vn" + $(e).attr("href")).get();
	}
	return [];
}
exports.parseDataContent = parseDataContent;
exports.parseDataUrl = parseDataUrl;
