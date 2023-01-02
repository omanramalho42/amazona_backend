import express from "express"
import cors from 'cors'

import data from "./data.js"

const app = express();
app.use(cors());

app.get("/api/products", (req, res) => {
  res.status(200).send(data.products);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server is Running on port: http://localhost:"+port);
});