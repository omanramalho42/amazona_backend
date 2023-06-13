import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/ProductModel.js';
import { isAuth } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res, next) => {
  const products = await Product.find();
  res.status(200).send(products);
});

const PAGE_SIZE = 3;

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get('/categories', expressAsyncHandler(async (req, res, next) => {
  const categories = await Product.find().distinct('category');
  res.status(200).send(categories);
}));

productRouter.get("/listproducts", isAuth, expressAsyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  
  // const { ...products } = await bussiness.getAllProductsList();

  if(products) {
    res.status(200).send({ products });
  } else {
    res.status(404).send({ message: 'Nenhum produto encontrado' });
  }
}));

productRouter.get("/slug/:slug", isAuth, expressAsyncHandler( async (req, res, next) => {
  const product = await Product.findOne({
    slug: req.params.slug
  });
  
  if(product) {
    res.status(200).send(product);
  } else {
    res.status(404).send({ message: 'Produto não encontrado' });
  }
}));

productRouter.put("/slug/:id", isAuth, expressAsyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
  if(product) {
    product.name        = req.body.name        || product.name;
    product.slug        = req.body.slug        || product.slug;
    product.price       = req.body.price       || product.price;
    product.rating      = req.body.rating      || product.rating;
    product.brand       = req.body.brand       || product.brand;
    product.category    = req.body.category    || product.category;
    product.description = req.body.description || product.description;
    
    const existSlug = await Product.findOne({ slug: req.body.slug || product.slug });

    if(existSlug?.slug === req.body.slug || !existSlug) {
      
      const updatedProduct = await product.save();

      res.send({
        message: "Sucesso ao editar o produto",
        product:{
        _id: updatedProduct._id,
        name: updatedProduct.name,
        slug: updatedProduct.slug,
        price: updatedProduct.price,
        rating: updatedProduct.rating,
        brand: updatedProduct.brand,
        category: updatedProduct.category,
        description: updatedProduct.description
      }});
      
    } else {
      res.status(404).send({ 
        message: "Este slug já existe" 
      });
    }

  } else {
    res.status(404).send({ 
      message: 'Produto não encontrado!'
    });
  }

}));

productRouter.delete("/slug/:id", isAuth, expressAsyncHandler( async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if(product) {
    product.deleteOne({ slug: product.slug });
    
    res.status(201).send({
      message: 'Produto deletado com sucesso'
    });
  } else {
    res.status(400).send({
      message: 'Produto não encontrado'
    });
  }

}));

productRouter.post("/slug/create", isAuth, expressAsyncHandler( async (req, res, next) => {
  const {
    name,
    slug,
    brand,
    price,
    rating,
    numReviews,
    category,
    description,
    countInStock,
    image
  } = req.body;

  const existSlug = await Product.findOne({ slug: req.body.slug || slug });

  if(existSlug) {
    res.status(401).send({
      message: "Este slug já está sendo usado em outro produto"
    });
  } else {
    const newProduct = new Product({
      name,
      slug,
      price,
      rating,
      brand,
      numReviews,
      category,
      description,
      countInStock,
      image
    });
    
    const product = await newProduct.save();

    res.status(201).send({
      message: "Sucesso ao criar novo produto",
      product
    });
  }

  res.status(201);
}));

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