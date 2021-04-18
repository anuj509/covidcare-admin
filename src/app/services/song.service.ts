import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const config = environment;
@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private http: HttpClient) { }
  getAll(params) {
      return this.http.get<any[]>(`${config.apiUrl}/songs?${params}`);
  }

  songCreate(song){
    console.log(song);
    const formData: FormData = new FormData();
    for (let i = 0; i < song.song.files.length; i++) {
      console.log(song.song.files[i]);
      formData.append('song', song.song.files[i], song.song.files[i].name);
    }
    return this.http.post<any>(`${config.apiUrl}/songs`,formData,{
      reportProgress: true,
      observe:'events'
    });
  }

  songUpdate(song){
    const formData: FormData = new FormData();
    for (let i = 0; i < song.song.files.length; i++) {
      console.log(song.song.files[i]);
      formData.append('song', song.song.files[i], song.song.files[i].name);
    }
    formData.append('_method','put');
    return this.http.post<any>(`${config.apiUrl}/songs/${song.id}`,formData,{
      reportProgress: true,
    });
  }

  getSong(songId){
    return this.http.get<any>(`${config.apiUrl}/songs/${songId}`)
  }

  deleteSong(songId){
    return this.http.delete<any>(`${config.apiUrl}/songs/${songId}`)
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
