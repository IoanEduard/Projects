import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../shared/models/IProduct';
import { IProductCategory } from '../shared/models/IProductCategory';
import { ShopParams } from '../shared/models/ShopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: IProduct[] = [];
  productCategories: IProductCategory[] = [];
  shopParams = new ShopParams();
  totalCount!: number;
  @ViewChild('search', { static: false }) searchTerm!: ElementRef;

  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getProductCategories();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe(response => {
      this.products = response!.data;
      this.shopParams.pageNumber = response!.pageIndex;
      this.shopParams.pageSize = response!.pageSize;
      this.totalCount = response!.count;
    })
  }

  getProductCategories() {
    this.shopService.getProductTypes().subscribe((response: IProductCategory[]) => {
      this.productCategories = [{ id: 0, name: 'All' }, ...response];
    });
  }

  onCategorySelected(categoryId: number) {
    this.shopParams.categoryId = categoryId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(event: any) {
    this.shopParams.sort = (<HTMLOptionElement>event.target).value;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event) {
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }

}
