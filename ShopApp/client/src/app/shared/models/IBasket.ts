export interface IBasketItem {
    // id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    category: string;
    // customerBasket: string;
    // customberBasketId: string;
}

export class IBasket {
    id!: string;
    items: IBasketItem[] = [];
    clientSecret?: string;
    paymentIntentId?: string;
    deliveryMethodId?: number;
    shippingPrice?: number;
    total?: number;
    subtotal?: number;
}

export class INewBasketItem {
    constructor(private productId: number, private quantity: number) {}
}

export interface IBasketTotals {
    shippingPrice: number;
    subtotal: number;
    total: number;
}