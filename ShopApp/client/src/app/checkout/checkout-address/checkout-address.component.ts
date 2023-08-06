import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/account/account.service';
import { IAddress } from 'src/app/shared/models/IAddress';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {

  @Input() checkoutForm!: FormGroup;

  constructor(private accountService: AccountService) { }

  ngOnInit() {
  }

  get firstName() {
    return this.checkoutForm.get('addressForm')?.get('firstName');
  }
  get lastName() {
    return this.checkoutForm.get('addressForm')?.get('lastName');
  }
  get street() {
    return this.checkoutForm.get('addressForm')?.get('street');
  }
  get city() {
    return this.checkoutForm.get('addressForm')?.get('city');
  }
  get state() {
    return this.checkoutForm.get('addressForm')?.get('state');
  }
  get zipCode() {
    return this.checkoutForm.get('addressForm')?.get('zipCode');
  }

  saveUserAddress() {
    this.accountService.updateUserAddress(this.checkoutForm.get('addressForm')?.value)
      .subscribe((address: IAddress) => {
        this.checkoutForm.get('addressForm')?.reset(address);
      }, error => {
        console.log(error);
      });
  }

}
