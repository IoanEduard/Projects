import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isLoggedIn: boolean;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {
      this.authService.isLoggedIn.subscribe(a => {
        this.isLoggedIn = a;
      });    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.isLoggedIn) return true;

      this.toastr.error('Login first');
      this.router.navigate(['/login']);

      return false;
  }
  
}
