import express from 'express';
import Product from '../models/ProductModel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res, next) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get("/slug/:slug", async (req, res, next) => {
  const product = await Product.findOne(
    { slug: req.params.slug }
  );
  
  if(product) {
    res.status(200).send(product);
  } else {
    res.status(404).send({ message: 'Produto não encontrado' });
  }

});

productRouter.get("/:id", async (req, res, next) => {
  const product = await Product.findById(
    req.params.id
  );
  
  if(product) {
    res.status(200).send(product);
  } else {
    res.status(404).send({ message: 'Produto não encontrado' });
  }

});


export default productRouter;