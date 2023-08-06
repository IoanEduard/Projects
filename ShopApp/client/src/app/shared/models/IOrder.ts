import { IAddress } from "./IAddress";

export interface IOrderToCreate {
    basketId: string;
    deliveryMethodId: number;
    shipToAddress: IAddress;
}

export interface IOrder {
    id: number;
    buyerEmail: string;
    orderDate: string;
    shipToAddress: IAddress;
    deliveryMethod: string;
    shippingPrice: number;
    orderItems: IOrderItem[];
    subtotal: number;
    total: number;
    status: string;
}

export interface IOrderItem {
    id: number;
    productId: number;
    productName: string;
    pictureUrl: string;
    price: number;
    quantity: number;
    category: string;
}