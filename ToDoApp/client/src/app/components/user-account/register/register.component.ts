import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OurToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastrService: OurToastrService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchingValidator })
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  onSubmit() {
    this.authService.register(this.registerForm.value).subscribe(_ => {
      this.toastrService.showSuccess('registration successful');
      this.router.navigate(['/tasks']);
    }, (error: any) => {
      this.toastrService.showError(`registration failed + \n${error}`)
    });
  }
}

export const passwordMatchingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password?.value === confirmPassword?.value ? null : { notmatched: true };
};