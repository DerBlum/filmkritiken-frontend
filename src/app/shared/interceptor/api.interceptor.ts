import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(private authService: UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!this.authService.isLoggedIn()) {
            return next.handle(req);
        }

        return this.authService.getAuthToken().
            pipe(
                take(1),
                switchMap(token => {
                    if (!token) {
                        throw new Error('Could not get token from AuthService');
                    }

                    // get Auth header value
                    const header = 'Bearer ' + token;

                    // set the Auth header
                    req = req.clone({
                        setHeaders: {
                            Authorization: header
                        }
                    });

                    return next.handle(req);
                }),
                catchError(_ => {
                    // send it without an Authorization Header
                    return next.handle(req);
                })
            );


    }

}
