import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, noop, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IUserNamesResponse } from '../models/dtos/UserNamesResponse';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	url: string = 'https://localhost:7284/api/auth/';
	isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.loggedIn());
	decodedToken: any;

	constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

	login(model: any) {
		return this.http.post<any>(this.url + 'login', model).pipe(
			map((response: any) => {
				const user = response;
				if (user) {
					localStorage.setItem('token', user.token);
					this.decodedToken = this.jwtHelper.decodeToken(user.name);
					this.isLoggedIn.next(true);
				}
			})
		);
	}

	register(model: any) {
		return this.http.post<any>(this.url + 'register', model);
	}

	loggedIn() {
		const token = localStorage.getItem('token');
		return token !== null ? this.jwtHelper.isTokenExpired(token) : false;
	}

	logOut() {
		localStorage.removeItem('token');
		this.decodedToken = undefined;
		this.isLoggedIn.next(false);
	}

	getUsersByName(name: string) {
		console.log(name);
		return this.http.get<IUserNamesResponse>(
			'https://localhost:7284/api/auth/searchUser', {
			params: { userName: name }
		}).pipe(
			map((data: IUserNamesResponse) => (data && data.items || [])),
			tap(() => noop, err => {
				// in case of http error
				return err && err.message || 'Something goes wrong';
			})
		);
	}
}
