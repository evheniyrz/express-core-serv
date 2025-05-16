const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Включаем CORS
app
  .use(cors())
  .use(function (req, res, next) {
    res.setHeader(
      "Access-Control-Allow-Origin",
      `https://evheniyrz.github.io/`
    );
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,PUT,OPTIONS,HEAD");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  })
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json());
/**================================================================ */
// Маршрут для получения геолокации https://iplocate.io/api/lookup
app.get("/geo", async (req, res) => {
  try {
    const response = await axios.get("https://iplocate.io/api/lookup", {
      params: { ...req.query, api_key: "b441794f8e447b5ea124387614a42910" },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Ошибка получения данных" });
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
    res.status(500).json({ error: "Ошибка получения данных" });
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
    res.status(500).json({ error, msg: "Ошибка получения данных" });
  }
});

// Маршрут для получения данных о погоде (пример для города "London")https://api.openweathermap.org/data/2.5
app.get("/weather", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: { ...req.query, appid: "f2f367b6802fb926387ec43c28c57846" },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error, ms: "Ошибка получения данных" });
  }
});
app.get("/forecast", async (req, res) => {
  console.log("==FORECAST==", { req });
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: { ...req.query, appid: "f2f367b6802fb926387ec43c28c57846" },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error, msg: "Ошибка получения данных" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`CORS сервер запущен на порту ${PORT}`);
});
