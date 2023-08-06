import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';
import { IProduct } from './shared/models/IProduct';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  products!: IProduct[];

  constructor(private http: HttpClient, private basketService: BasketService, private accountService: AccountService) {

  }

  ngOnInit() {
    this.loadBasket();
    this.loadUser();
  }

  loadBasket() {
    const basketId = localStorage.getItem('basket_id');

    if (basketId) {
      this.basketService.getBasket(basketId).subscribe(result => {
      })
    }
  }

  loadUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token!).subscribe(() => {
      console.log('loaded user');
    }, (error: any) => {
      console.log(error);
    },() => {});
  }
}
