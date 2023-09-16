const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const backupres = require("./apiResponsebackup");
app.use(cors());
const CircularJSON = require("circular-json");
const stripe = require("stripe")(
  "sk_test_51NdCoiSFgNssnXOVeOPbujpmoi8A7aiMQzzdzqA9AYux8dMG8AHLEDZ4ru0unUr6kDShvmKbCy3m3uu7t7UOSR2F00GpvRYY89"
);

app.get("/getClientSec", async (req, res) => {
  const cost = req.header("Cost") + "00";
  console.log(cost);
  const intent = await stripe.paymentIntents.create({
    amount: cost,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.set({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.json({ client_secret: intent.client_secret });
});

app.get("/fetchNetflix", async (req, res) => {
  const searchTerm = req.header("searchTerm");
  const options = {
    method: "GET",
    url: "https://netflix54.p.rapidapi.com/search/",
    params: {
      query: searchTerm,
      offset: "0",
      limit_titles: "25",
      limit_suggestions: "20",
      lang: "en",
    },
    headers: {
      "X-RapidAPI-Key": "75ac0be1e8msh07be2f82377f756p18cbb9jsn6de7d7f7f11a",
      "X-RapidAPI-Host": "netflix54.p.rapidapi.com",
    },
  };
  console.log("sending backup");
  try {
    // const response = await axios.request(options);
    // const str = CircularJSON.stringify(response);
    // const finalObj = JSON.parse(str);
    // const sendRes =
    //   finalObj.data.titles.length > 0
    //     ? [finalObj.data.titles, finalObj.data.suggestions]
    //     : [backupres.titles, backupres.suggestions];
    const sendRes = [backupres.titles, backupres.suggestions];
    res.send(sendRes);
  } catch (error) {
    console.log("error");
  }
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
