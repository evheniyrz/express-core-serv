const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Включаем CORS
app
  .use(cors())
  .use(function (req, res, next) {
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.DEV_MODE === "true"
        ? `http://localHost:${PORT}`
        : `https://evheniyrz.github.io`
    );
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,PUT,OPTIONS,HEAD");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.set({
      // prevent page rendering in <iframe>, <object>, <frame>
      "X-Frame-Options": "SAMEORIGIN",
      // only valid parents that may embed a page using <frame>, * <iframe>, <object>, <embed>, or <applet>.
      "Content-Security-Policy": `frame-ancestors 'self' https://evheniyrz.github.io;`,
      // lets a web site tell browsers that it should only be requested via HTTPS. Protects against man-in-the-middle attacks.
      // param 'preload' adding site to HSTS list.
      "Strict-Transport-Security":
        "max-age=31536000; includeSubDomains; preload",
      // indicates that MIME types declared in the Content-Type headers should be respected and not changed by server.
      "X-Content-Type-Options": "nosniff",
      // If cross-site scripting (XSS) is detected, the browser will delete insecure content.
      "X-XSS-Protection": 1,
    });
    next();
  })
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json());
/**================================================================ */
// Маршрут для получения геолокации https://iplocate.io/api/lookup
app.get("/geo", async (req, res) => {
  try {
    const response = await axios.get("https://iplocate.io/api/lookup", {
      params: { ...req.query, api_key: process.env.GEO_API_ACCESS },
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.status).json(...error);
  }
});

// Маршрут для получения списка стран https://restcountries.com/v3.1/name
app.get("/countries/:name", async (req, res) => {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${req.params["name"]}`,
      {
        params: req.query,
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.status).json(...error);
  }
});
// Маршрут для получения списка стран https://countriesnow.space/api/v0.1/countries/cities
app.post("/cities", async (req, res) => {
  try {
    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/cities",
      {
        ...req.body,
      }
    );
    res.json(response.data);
  } catch (error) {
    console.log("ERROR=CITY", error);
    res.status(error.status).json(...error);
  }
});

// Маршрут для получения данных о погоде (пример для города "London")https://api.openweathermap.org/data/2.5
app.get("/weather", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: { ...req.query, appid: process.env.OPEN_WEATHER_ACCESS },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.status).json({ error, ms: "Ошибка получения данных" });
  }
});
app.get("/forecast", async (req, res) => {
  console.log("==FORECAST==", { req });
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: { ...req.query, appid: process.env.OPEN_WEATHER_ACCESS },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.status).json(...error);
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`CORS сервер запущен на порту ${PORT}`);
});
