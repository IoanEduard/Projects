import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/IOrder';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  order!: IOrder;

  constructor(private route: ActivatedRoute, private breadcrumbService: BreadcrumbService, private ordersService: OrderService) {
    this.breadcrumbService.set('@OrderDetailed', '');
  }

  ngOnInit() {
    this.ordersService.getOrderDetailed(+this.route.snapshot.paramMap.get('id')!)
      .subscribe((order: IOrder) => {
      this.order = order;
      this.breadcrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
    }, error => {
      console.log(error);
    });
  }
}
