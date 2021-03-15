const request = require("request-promise");
const cheerio = require("cheerio");
var moment = require('moment');
const { json, errorJson } = require("../utils/response");

exports.index = (req, res) => {
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    return json(res, {
        maintainer: "Azhari Muhammad M <azhari.marzan@gmail.com>",
        source: "https://github.com/azharimm/twitter-trends-api",
        location: {
            endpoint: '/location',
            example: fullUrl+'location',
        },
        trends: {
            endpoint: '/trends',
            example: fullUrl+'trends?location=indonesia'
        }
    });
};

exports.trends = async (req, res) => {
    const { location } = req.query;
    let baseUrl = `${process.env.BASE_URL}`;
    let locationName = "Worldwide";
    if (location) {
        baseUrl = baseUrl + "/"+ location;
        locationName = location.toUpperCase().replace('-',' ');
    }
    try {
        const htmlResult = await request.get(baseUrl);
        const $ = await cheerio.load(htmlResult);
        const trends = [];
        $(".trend-card").each((index, el) => {
            let datetime = $(el).find(".trend-card__time").text();
            let time = moment(datetime, 'DD-MM-YYYY - HH:mm:ss').fromNow();
            let temp = [];
            $(el)
                .find(".trend-card__list")
                .find("li")
                .each((key, el) => {
                    let name = $(el).find("a").text();
                    let tweet_count = $(el).find(".tweet-count").text();
                    temp.push({ name, tweet_count });
                    trends[index] = {
                        datetime,
                        time,
                        data: temp,
                    };
                });
        });

        return json(res, { location: locationName, trends });
    } catch (error) {
        return errorJson(res, error);
    }
};

exports.location = async (req, res) => {
    try {
        const htmlResult = await request.get(`${process.env.BASE_URL}`);
        const $ = await cheerio.load(htmlResult);
        const locations = [];
        $(".suggested-locations__list")
            .children("li")
            .each((index, el) => {
                let location = $(el).text().replace(' ', '-');
                locations.push({
                    location_path: location.toLocaleLowerCase(),
                    location_url:
                        "/trends?location=" + location.toLocaleLowerCase(),
                });
            });

        return json(res, locations);
    } catch (error) {
        return errorJson(res, error);
    }
};
