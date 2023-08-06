import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { IBasket, IBasketItem, IBasketTotals, INewBasketItem } from '../shared/models/IBasket';
import { IDeliveryMethod } from '../shared/models/IDeliveryMethod';
import { IProduct } from '../shared/models/IProduct';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = 'https://localhost:7046/api/';

  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals | null>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping = 0;

  constructor(private http: HttpClient) {
  }

  getBasket(id: string | null) {
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id)
      .pipe(
        map(
          (basket: IBasket) => {
            this.basketSource.next(basket);
             this.calculateTotals();
          }
        )
      );
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  setBasket(basket: IBasket, itemToAdd: IBasketItem, quantity: number) {
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);

    return this.http.post<IBasket>(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
       this.calculateTotals();
    }, error => {
      console.log(error);
    })
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);

    const basket = this.getCurrentBasketValue();

    if (!basket) {
      const newBasket = new INewBasketItem(itemToAdd.productId, quantity);
      this.createNewEmptyBasket(newBasket);
    }
    else {
      this.setBasket(basket, itemToAdd, quantity);
    }
  }

  updateQuantity(item: IBasketItem, flag: boolean) {
    const apiCall = flag ? 'incrementQuantity' : 'decrementQuantity';

    const basket = this.getCurrentBasketValue();
    const itemIndex = basket?.items.findIndex(i => i.productId === item.productId);

    if (itemIndex !== undefined) {
      if (basket?.items[itemIndex].quantity === 1 && apiCall === 'decrementQuantity') {
        this.removeItemFromBasket(item, itemIndex);
      }
      else {
        this.http.post<IBasketItem>(this.baseUrl + `basket/${apiCall}/${basket?.items[itemIndex].productId}`, {}).subscribe((response: IBasketItem) => {
          basket!.items[itemIndex].quantity = response.quantity;
          this.basketSource.next(basket);
           this.calculateTotals();
          
        }, error => {
          console.log(error);
        })
      }
    }
  }

  removeItemFromBasket(item: IBasketItem, itemIndex: number) {
    const basket = this.getCurrentBasketValue();
    if (basket?.items.some(i => i.productId === item.productId)) {
      this.http.delete<IBasketItem>(this.baseUrl + `basket/removeItemFromBasket/${basket?.items[itemIndex].productId}`, {}).subscribe(deleted => {
        if (deleted) {
          basket.items = basket.items.filter(i => i.productId !== item.productId);
          if (basket.items.length < 1) {
            this.deleteBasket(basket.id);
            localStorage.removeItem('basket_id');
          }
        }
      })
    }
  }

  deleteBasket(id: string) {
    this.http.delete<IBasketItem>(this.baseUrl + `basket/deleteBasket/${id}`).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    })
  }

  deleteLocalBasket() {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  createPaymentIntent() {
    return this.http.post<IBasket>(this.baseUrl + 'payment/' + this.getCurrentBasketValue()!.id, {})
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
        })
      );
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket!.deliveryMethodId = deliveryMethod.id;

    return this.http.post<IBasket>(this.baseUrl + 'basket/setShippingPrice', basket).subscribe(result => {
      basket!.shippingPrice = result.shippingPrice;
      this.basketTotalSource.next({ shippingPrice: result.shippingPrice!, total: result.total!, subtotal: result.subtotal! });
    })
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    let index = -1;
    if (items) {
      index = items.findIndex(i => i.productId === itemToAdd.productId);
    }
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private createNewEmptyBasket(newBasket: INewBasketItem) {
    this.http.post(this.baseUrl + 'basket/createEmptyBasket', newBasket).subscribe((result: any) => {
      localStorage.setItem('basket_id', result.id);
      this.basketSource.next(result);
      this.basketTotalSource.next({ shippingPrice: result.shippingPrice!, total: result.total!, subtotal: result.subtotal! });
    }, error => {
      console.log(error);
    }, () => {
    });
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shippingPrice = 0;
    const subtotal = basket?.items.reduce((a, b) => (b.price * b.quantity) + a, 0)!;
    const total = shippingPrice + subtotal;
    this.basketTotalSource.next({ shippingPrice, total, subtotal });
  }

  // debug the type to see if is right
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      // id: item.id,
      productId: item.id,
      productName: item.name,
      price: +item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      category: item.productCategory
    }
  }
}
