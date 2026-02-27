const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const webhookRoutes = require("./routes/webhook.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("RAW REQUEST HIT:", req.method, req.url);
  next();
});
app.use("/webhook", webhookRoutes);

module.exports = app;
