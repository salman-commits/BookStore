import { HttpBackend, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Role, User } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private customHttpClient: HttpClient;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, backend: HttpBackend) {
    this.customHttpClient = new HttpClient(backend);
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.get<any>(`${environment.apiUrl}/api/account/authenticate/${email}/${password}`)
      .pipe(map(user => {
                if (user) {
          let validUser = new User();
          validUser.Email = email;          
          localStorage.setItem('currentUser', JSON.stringify(validUser));
          this.currentUserSubject.next(validUser);
        }
        return user;
      }));
  }

  getAccessToken(username: string, password: string): Observable<any> {    

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.set('grant_type', 'password');
    urlSearchParams.set('username', username);
    urlSearchParams.set('password', password);
    let body = urlSearchParams.toString();    
    return this.customHttpClient.post<any>(`${environment.apiUrl}/token`, body)
      .pipe(map(result => {
        // Sign in successfully if there's an access token in the response.  
        if (typeof result.access_token !== 'undefined') {
          // Stores access token & refresh token.  
          this.store(result.access_token);
        }
        if (result) {
          let validUser = new User();
          validUser.Email = username;          
          localStorage.setItem('currentUser', JSON.stringify(validUser));
          this.currentUserSubject.next(validUser);
        }
        return result;
      }));
  }
  private store(access_token: any): void {
    // Stores access token in local storage to keep user signed in.  
    localStorage.setItem('access_token', access_token);    
  }

  logOut() {
    console.log('inside logout()');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUserItemCount');
    localStorage.removeItem('userShoppingItemDetailsSubject');
    
    this.currentUserSubject.next(null!);
  }

 SignUpUser(user: User) {
    console.log('inside service SignUpUser: ', user);
    return this.http.post<any>(`${environment.apiUrl}/api/Account/SignUpUser`,
      JSON.stringify(user),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  getUserRoles() {
    console.log('inside getUserRoles auth service');
    return this.http.get<Role[]>(`${environment.apiUrl}/api/Account/GetUserRoles`);
  }
}
