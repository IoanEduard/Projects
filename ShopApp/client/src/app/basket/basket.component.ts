import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem, IBasketTotals } from '../shared/models/IBasket';
import { BasketService } from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basketTotals$!: Observable<IBasketTotals | null>;
  basket$!: Observable<IBasket | null>;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.basketTotals$ = this.basketService.basketTotal$;
  }

  updateQuantity(item: IBasketItem, flag: boolean) {
    this.basketService.updateQuantity(item, flag);
  }

  deleteBasketItem(item: IBasketItem, itemIndex: number) {
    this.basketService.removeItemFromBasket(item, itemIndex);
  }
}
