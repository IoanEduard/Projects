import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, of, switchMap, timer } from 'rxjs';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errors: string[] = [];

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.registerForm = new FormGroup({
      displayName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
      ], [this.validateEmailNotTaken()]),
      password: new FormControl('', [Validators.required])
    })
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get displayName() {
    return this.registerForm.get('displayName');
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe(() => {
      this.router.navigateByUrl('/shop');
    }, error => {
      console.log(error);
      this.errors = error.error.errors;
    })
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.accountService.checkEmailExists(control.value).pipe(
            map((res) => {
              return res ? { emailExists: true } : null;
            })
          );
        })
      );
    };
  }
}
