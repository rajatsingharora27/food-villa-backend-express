import { TRUE } from "../constants/applicationConstants";
import { PRODUCT_ALREADY_IN_DATABASE_0005_1 } from "../constants/errorMessage";
import productDetailModel from "../model/productDetailModel";

class GetProductService {
  getTheRequstedProducts = async (query: any) => {
    let productData;
    const { category, festive } = query;
    console.log(category, festive);
    if (category == "all") {
      productData = await productDetailModel.find({});
    } else {
      let queryBuild = buildQuery(query);
      productData = await productDetailModel.find(queryBuild);
    }
    return {
      isValid: TRUE,
      errorMessage: [],
      data: productData,
    };
  };
}
function buildQuery(query: any) {
  let queryOBJ = {};

  if (query.category !== undefined) {
    queryOBJ = { ...queryOBJ, productCategory: query.category };
  }
  if (query.festive !== undefined) {
    queryOBJ = { ...queryOBJ, festiveTag: query.festive };
  }
  return queryOBJ;
}

export default GetProductService;
