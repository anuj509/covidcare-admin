import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import * as SecureLS from 'secure-ls'

const SECRET_KEY = 'LqzQ5JZl6xvLOYNxe7b7CR3ZJ40p7S1wL0inzNtAeKUS1feVRz3ciL503EqgcQZi';
var storage = new SecureLS({encodingType: 'des', isCompression: false, encryptionSecret: SECRET_KEY});
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  currentUserLocalStorageName = '__spark__';
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(storage.get(this.currentUserLocalStorageName));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
      return this.http.post<any>(`${environment.apiUrl}/login`, { email, password })
          .pipe(map(user => {
              // if(user.data.user.role!="admin"){
              //   return false;
              // }
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              storage.set(this.currentUserLocalStorageName, user.data);
              this.currentUserSubject.next(user.data);
              return user.data;
              ////console.log("this should'nt be printed");
          }));
  }
  logout() {
      // remove user from local storage to log user out
      storage.clear();
      this.currentUserSubject.next(null);
  }
}
