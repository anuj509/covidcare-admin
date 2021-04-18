import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

const config = environment;
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

    getAll(params:string) {
        return this.http.get<any[]>(`${config.apiUrl}/users?${params}`);
    }

    getUser(userId){
      return this.http.get<any>(`${config.apiUrl}/users/${userId}`)
    }
}
