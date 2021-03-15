const request = require("request-promise");
const cheerio = require("cheerio");
const { json, errorJson } = require("../utils/response");

exports.index = (req, res) => {
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    return json(res, {
        maintainer: "Azhari Muhammad M <azhari.marzan@gmail.com>",
        source: "https://github.com/azharimm/twitter-trends-api",
    });
};

exports.trends = async (req, res) => {
    const htmlResult = await request.get(`${process.env.BASE_URL}`);
    const $ = await cheerio.load(htmlResult);
    const trends = [];
    const location = 'Worldwide';
    $(".trend-card").each((index, el) => {
        let time = $(el).find(".trend-card__time").text();
        let temp = [];
        $(el)
            .find(".trend-card__list")
            .find("li")
            .each((key, el) => {
                let name = $(el).find("a").text();
                let tweet_count = $(el).find(".tweet-count").text();
                temp.push({ name, tweet_count });
                trends[index] = {
                    time: time,
                    data: temp,
                };
            });
    });

    return json(res, {location, trends});
};

exports.location = async (req, res) => {
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    const htmlResult = await request.get(`${process.env.BASE_URL}`);
    const $ = await cheerio.load(htmlResult);
    const locations = [];
    $(".suggested-locations__list")
        .children("li")
        .each((index, el) => {
            let location = $(el).text();
            locations.push({
                location_path: location.toLocaleLowerCase(),
                location_url: '/trends?location='+location.toLocaleLowerCase(),
            });
        });

    return json(res, locations);
};
