import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs';
import { IPagination } from '../shared/models/IPagination';
import { IProduct } from '../shared/models/IProduct';
import { IProductCategory } from '../shared/models/IProductCategory';
import { ShopParams } from '../shared/models/ShopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:7046/api/'

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams) {
    let specParams = new HttpParams();

    if (shopParams.categoryId !== 0) {
      specParams = specParams.append('categoryId', shopParams.categoryId.toString())
    }

    if(shopParams.search){
      specParams = specParams.append('search', shopParams.search); 
    }

    specParams = specParams.append('sort', shopParams.sort);
    specParams = specParams.append('pageIndex', shopParams.pageNumber.toString());
    specParams = specParams.append('pageSize', shopParams.pageSize.toString());
    

    return this.http.get<IPagination>(this.baseUrl + 'product', { observe: 'response', params: specParams })
      .pipe(
        map(response => {
          return response.body;
        }));
  }

  getProductTypes() {
    return this.http.get<IProductCategory[]>(this.baseUrl + 'product/categories');
  }

  getProduct(id: number) {
    return this.http.get<IProduct>(this.baseUrl + 'product/' + id);
  }


}
