import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/IProduct';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product!: IProduct;

  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService) 
  { 
    this.breadcrumbService.set('@productDetails', ' ');
  }

  ngOnInit(): void {
    this.loadProduct(2);
  }

  loadProduct(id: number) {
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')!).subscribe(result => {
      this.product = result;
      this.breadcrumbService.set('@productDetails', this.product.name)
    }, error => {
      console.log(error);
    })
  }
}
