import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  transformError(err: { [key: string]: any }) {
    const messages: string[] = [];
    if (err) {
      for (let key of Object.keys(err)) {
        for (let message of err[key]) {
          messages.push(`${key}: ${message}`);
        }
      }
    }
    return messages;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        let handled: boolean = false;
        console.error(error);
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            console.error("Error Event");
          } else {
            switch (error.status) {
              case 401:      //Unauthorized
                this.router.navigate(['error', error.status, error.statusText]);
                //this.router.navigateByUrl("/login");                
                handled = true;
                break;

              case 403:     //forbidden
                this.router.navigateByUrl("/login");
                handled = true;
                break;

              case 404:     //not found.                
                this.router.navigate(['error', error.status, error.error.Message]);
                handled = true;
                break;

              case 500:     //Internal Server Error
                this.router.navigate(['error', error.status, error.statusText]);
                handled = true;
                break;

              case 0:     //forbidden                
                this.router.navigate(['error', error.status, error.statusText]);
                handled = true;
                break;
            }
          }
        }
        else {
          console.error("Other Errors");
        }
        if (handled) {
          return of(error);
        } else {
          return throwError(error);
        }
      })
    )
  }
}