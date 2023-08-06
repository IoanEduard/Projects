import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  spinnerRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) { }

  spinnerBusy() {
    this.spinnerRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'timer',
      bdColor: 'rgba(255, 255, 255, 0.7)',
      color: '#333333'
    });
  }

  spinnerIdle() {
    this.spinnerRequestCount--;
    if (this.spinnerRequestCount <= 0) {
      this.spinnerRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
