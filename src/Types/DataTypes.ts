export interface SIGNUP_USER {
  userName?: string;
  emailId: string;
  password: string;
  phoneNumber?: string;
  cartItems?: Array<CART_ITEM_TYPE>;
  wishListItems?: Array<string>;
}

export interface CART_ITEM_TYPE {
  // product: string;
  productId: string;
  quantity?: number;
  increase?: boolean;
  decrease?: boolean;
}

export interface VALIDATION_RETURN_VALUE {
  isValid: boolean;
  error: Array<string>;
  data?: Object | null;
}

export interface TokenInformationType {
  userName: string;
  emailId: string;
  phoneNumber: string;
  password: string;
  role: string;
  userId: string;
  refId?: string;
}

export interface UserInputRequest {
  userName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: string;
  hasAdminAccess?: boolean;
  userId?: string;
}

export interface DECODE_TOKEN {
  userName: string;
  role: string;
  email: string;
  userId: string;
  iat?: number;
  exp?: number;
}

export interface WISHLIST_ADD_BODY {
  token: string;
  wishlistAdd: boolean;
  productId: string[];
}

export interface PRODUCT_BODY extends WISHLIST_ADD_BODY {
  productToCartQuantity: {
    quantity: number;
    increase: boolean;
    decrease: boolean;
  };
}
