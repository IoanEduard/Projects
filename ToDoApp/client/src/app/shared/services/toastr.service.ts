import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class OurToastrService {

  constructor(private toastr: ToastrService) {}

  showSuccess(successMessage: string) {
    this.toastr.success(successMessage);
  }

  showError(error: any) {
    this.toastr.error(error)
  }

  showWarning(warning: any) {
    this.toastr.warning(warning)
  }

  showMessage(message: any) {
    this.toastr.info(message)
  }
}