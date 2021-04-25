import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

const config = environment;
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

    getAll(params:string) {
        return this.http.get<any[]>(`${config.apiUrl}/posts?${params}`);
    }

    getPost(postId){
      return this.http.get<any>(`${config.apiUrl}/posts/${postId}`)
    }

    postCreate(post){
      // console.log(resource);
      return this.http.post<any>(`${config.apiUrl}/posts`,post);
    }

    deletePost(postId){
      return this.http.delete<any>(`${config.apiUrl}/posts/${postId}`)
    }

    closePost(post,data){
      return this.http.post<any>(`${config.apiUrl}/posts/statusupdate/${post.user_id}`,data);
    }
}
