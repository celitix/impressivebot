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

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is up and running.",
  });
});

app.use("/webhook", webhookRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "The requested route does not exist on this server.",
  });
});

module.exports = app;
