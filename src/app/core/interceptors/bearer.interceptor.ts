import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../shared/services/authentication.service';


@Injectable()
export class BearerAuthInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with bearer auth credentials if available        
        let token = localStorage.getItem('access_token');
        if (token) {            
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });            
        }
        return next.handle(request);
    }
}