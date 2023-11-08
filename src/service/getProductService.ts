import { TRUE } from "../constants/applicationConstants";
import { PRODUCT_ALREADY_IN_DATABASE_0005_1 } from "../constants/errorMessage";
import productDetailModel from "../model/productDetailModel";

class GetProductService {
  getTheRequstedProducts = async (query: any) => {
    let productData;
    const { category, festive } = query;
    console.log(category, festive);

    let queryBuild = buildQuery(query);
    productData = await productDetailModel.find(queryBuild);

    return {
      isValid: TRUE,
      errorMessage: [],
      data: {
        totalProducts: productData.length,
        productDetails: productData,
      },
    };
  };
}
function buildQuery(query: any) {
  let queryOBJ = {};

  if (query.category == "all") {
    return queryOBJ;
  }
  if (query.category !== undefined) {
    queryOBJ = { ...queryOBJ, productCategory: query.category };
  }
  if (query.festive !== undefined) {
    queryOBJ = { ...queryOBJ, festiveTag: query.festive };
  }
  return queryOBJ;
}

export default GetProductService;
