
import Product from '../../models/ProductModel.js';

const getAllProductsList = async () => {
  const products = await Product.find({}); 

  return {
    products
  }
}

export { getAllProductsList };