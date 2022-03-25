const config = require("./config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(config.DATABASE_URL)
  .then(() => console.log("connected to database"))
  .catch((err) => console.log("could not connect to database", { err }));

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use(routes);

app.listen(config.PORT, () =>
  console.log(`server running on port ${config.PORT}`)
);
