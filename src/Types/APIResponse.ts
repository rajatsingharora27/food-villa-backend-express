export interface API_RESPONSE {
  refId: string;
  message: Array<String>;
  data: ResponseData;
}

export interface ResponseData {
  token?: string;
  cartItems?: Array<ProductAndQuantity>;
  wishListItem?: Array<string>;
}

export interface ProductAndQuantity {
  product: string;
  quantity: number;
}

export interface VALIDATION_RESPONSE {
  isValid: boolean;
  message: [string];
  data: {};
}
