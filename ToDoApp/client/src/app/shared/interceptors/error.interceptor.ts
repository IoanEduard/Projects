import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			retry(1),
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401) {
					return throwError(error.statusText);
				}

				if (error instanceof HttpErrorResponse) {
					const applicationError = error.headers.get('Application-Error');
					if (applicationError) {
						return throwError(applicationError);
					}
				}

				const serverError = error.error;
				let modelStateErrors = '';

				if (serverError.errors && typeof serverError.errors === 'object') {
					for (const key in serverError.errors) {
						if (serverError.errors[key]) {
							modelStateErrors += serverError.errors[key] + '\n';
						}
					}
				}

				return throwError(modelStateErrors || serverError || 'Server Error');
			})
		);
	}
}

export const ErrorInterceptorProvider = {
	provide: HTTP_INTERCEPTORS,
	useClass: ErrorInterceptor,
	multi: true
};
