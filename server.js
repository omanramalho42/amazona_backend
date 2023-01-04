import express from "express"
import cors from 'cors'

import data from "./data.js"

const app = express();
app.use(cors());

app.get("/api/products", (req, res) => {
  res.status(200).send(data.products);
});

app.get("/api/products/slug/:slug", async (req, res) => {

  const product = data.products.find(
    product => product.slug === req.params.slug
  );
  
  if(product) {
    res.status(200).send(product);
  } else {
    res.status(404).send({ message: 'Produto não encontrado' });
  }

});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server is Running on port: http://localhost:"+port);
});