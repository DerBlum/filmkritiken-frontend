import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import { Observable } from "rxjs";
import { UserService } from "../user/user.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(private authService: UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!this.authService.isLoggedIn()) {
            return next.handle(req);
        }

        // get Auth header value
        const header = 'Bearer ' + this.authService.getAuthToken();

        // set the Auth header
        req = req.clone({
            setHeaders: {
                Authorization: header
            }
        })

        // go on
        return next.handle(req)
    }

}