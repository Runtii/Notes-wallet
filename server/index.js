const express = require("express");
const app = express();
const PORT = 3001;
const cors = require("cors");
const queries = require("./queries.js");

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log("Server is running");
});
