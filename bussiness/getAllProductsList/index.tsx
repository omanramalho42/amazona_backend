import * as repository from '../../repository/getAllProductsList';

const getAllProductsList = async () => {
  const products = repository.getAllProductsList();
  
  return {
    products
  }
}

export { getAllProductsList };