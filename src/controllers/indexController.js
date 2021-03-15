const request = require("request-promise");
const cheerio = require("cheerio");
const { json, errorJson } = require('../utils/response');

exports.index = (req, res) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    
    return json(res, {
        maintainer: 'Azhari Muhammad M <azhari.marzan@gmail.com>',
        source: 'https://github.com/azharimm/twitter-trends-api',
    });
}

exports.test = async (req, res) => {
    const htmlResult = await request.get(
        `${process.env.BASE_URL}`
    );
    const $ = await cheerio.load(htmlResult);
    const data = $(".page-content__title").text();
    const trends = [];
    $(".trend-card").each((index, el) => {
        let time = $(el).find(".trend-card__time").text();
        let temp = [];
        $(el).find(".trend-card__list").find('li').each((key, el) => {
            let trend = $(el).find('a').text();
            let count = $(el).find('.tweet-count').text()
            temp.push({trend, count});
            trends[index] = {
                time: time,
                data: temp
            };
        });
    });

    return json(res, trends);
}