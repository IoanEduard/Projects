import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, finalize, Observable } from "rxjs";
import { SpinnerService } from "../services/spinner.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private spinnerService: SpinnerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method === 'POST' && req.url.includes('orders'))
            return next.handle(req);

        if (!req.url.includes('emailExists')) {
            return next.handle(req);
        }

        this.spinnerService.spinnerBusy();

        return next.handle(req).pipe(
            delay(1000),
            finalize(() => {
                this.spinnerService.spinnerIdle();
            })
        )
    }
}