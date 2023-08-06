import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, of, ReplaySubject } from 'rxjs';
import { IAddress } from '../shared/models/IAddress';
import { IUser } from '../shared/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:7046/api/';

  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  loadCurrentUser(token: string) {
    if (token === null) {
      this.currentUserSource.next(null as any);
      return of(null as any);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(this.baseUrl + 'account', { headers }).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  login(values: any) {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(values: any) {
    return this.http.post<IUser>(this.baseUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null as any);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailExists?email=' + email);
  }

  getUserAddress() {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    
    return this.http.get<IAddress>(this.baseUrl + 'account/address', { headers });
  }

  updateUserAddress(address: IAddress) {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.put<IAddress>(this.baseUrl + 'account/address', address, { headers });
  }
}
