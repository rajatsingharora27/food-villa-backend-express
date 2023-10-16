export type ProductType={
    productName:string,
    productPrice:string,
    tagLine:string,
    inventory:number,
    inStock:boolean,
    productDetails:ProductDetailsObject,
    productCategory:string,
    festiveTag:string

}


export type ProductDetailsObject={
    storageAndConsumption?:string,
    servingInstrinctions?:string,
    ingredients?:string,
    allergens?:string,
}