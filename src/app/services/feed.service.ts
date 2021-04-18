import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

const config = environment;
@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http: HttpClient) { }
  getAll(params) {
      return this.http.get<any[]>(`${config.apiUrl}/feeds?${params}`);
  }

  feedCreate(feed){
    // console.log(feed);
    return this.http.post<any>(`${config.apiUrl}/feeds`,feed);
  }

  feedUpdate(feed){
    return this.http.put<any>(`${config.apiUrl}/feeds/${feed.id}`,feed);
  }

  getFeed(feedId){
    return this.http.get<any>(`${config.apiUrl}/feeds/${feedId}`)
  }

  deleteFeed(feedId){
    return this.http.delete<any>(`${config.apiUrl}/feeds/${feedId}`)
  }
}
