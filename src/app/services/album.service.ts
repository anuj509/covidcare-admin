import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

const config = environment;
@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private http: HttpClient) { }
  getAll(params) {
      return this.http.get<any[]>(`${config.apiUrl}/albums?${params}`);
  }

  albumCreate(album){
    console.log(album);
    const formData: FormData = new FormData();
    if(album.cover){
      for (let i = 0; i < album.cover.files.length; i++) {
        console.log(album.cover.files[i]);
        formData.append('cover', album.cover.files[i], album.cover.files[i].name);
      }
    }
    formData.append('name',album.name);
    return this.http.post<any>(`${config.apiUrl}/albums`,formData);
  }

  albumUpdate(album){
    const formData: FormData = new FormData();
    if(album.cover){
      for (let i = 0; i < album.cover.files.length; i++) {
        console.log(album.cover.files[i]);
        formData.append('cover', album.cover.files[i], album.cover.files[i].name);
      }
    }
    formData.append('name',album.name);
    formData.append('_method','put');
    return this.http.post<any>(`${config.apiUrl}/albums/${album.id}`,formData);
  }

  getAlbum(albumId){
    return this.http.get<any>(`${config.apiUrl}/albums/${albumId}`)
  }

  deleteAlbum(albumId){
    return this.http.delete<any>(`${config.apiUrl}/albums/${albumId}`)
  }

  getAlbumSongs(albumId){
    return this.http.get<any>(`${config.apiUrl}/album/${albumId}/songs`)
  }

  deleteAlbumSong(albumId,songId){
    return this.http.delete<any>(`${config.apiUrl}/album/${albumId}/song/${songId}`)
  }

  addAlbumSong(albumId,songId){
    return this.http.get<any>(`${config.apiUrl}/album/${albumId}/song/${songId}`)
  }
}
