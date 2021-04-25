import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }
  getMenu(): Array<any> {
    const menu = [
      { name: 'Dashboard', path: './home', children: [] },
      { name: 'Login', path: './login', children: [] },
      { 
        name: 'Resources', 
        path: './resources', 
        children: [
          {
            name: 'Create Resource',
            path: './create',
            children: []
          },
          {
            name: 'Edit Resource',
            path: './edit',
            children: []
          }
        ] 
      },
      { 
        name: 'Feeds', 
        path: './feeds', 
        children: [] 
      },
      { 
        name: 'Users', 
        path: './users', 
        children: [
          {
            name: 'Create User',
            path: './create',
            children: []
          }
        ] 
      },
      { 
        name: 'Posts', 
        path: './posts', 
        children: [] 
      }
    ];

    return menu;
  }
}
