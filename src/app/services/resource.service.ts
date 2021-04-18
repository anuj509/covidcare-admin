import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
const config = environment;
@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private http: HttpClient) { }
  getAll(params) {
      return this.http.get<any[]>(`${config.apiUrl}/suppliers?${params}`);
  }

  resourceCreate(resource){
    // console.log(resource);
    return this.http.post<any>(`${config.apiUrl}/suppliers`,resource);
  }

  resourceUpdate(resource){
    return this.http.put<any>(`${config.apiUrl}/suppliers/${resource.id}`,resource);
  }

  getResource(resourceId){
    return this.http.get<any>(`${config.apiUrl}/suppliers/${resourceId}`)
  }

  deleteResource(resourceId){
    return this.http.delete<any>(`${config.apiUrl}/suppliers/${resourceId}`)
  }
}
