import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OurToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastrService: OurToastrService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', Validators.required]
    });
  }

  onSubmit(){
    this.authService.login(this.loginForm.value).subscribe(
      next => {
        this.toastrService.showSuccess('login successful');
        this.router.navigate(['/tasks']);
      }, 
      error => {
        this.toastrService.showError(`\n${error.error.title}`)
        console.log(error);
      }
    );
  }

  
}
