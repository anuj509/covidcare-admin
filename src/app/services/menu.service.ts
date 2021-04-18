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
      // { 
      //   name: 'Albums', 
      //   path: './albums', 
      //   children: [
      //     {
      //       name: 'Create Album',
      //       path: './create',
      //       children: []
      //     },
      //     {
      //       name: 'Edit Album',
      //       path: './edit',
      //       children: []
      //     }
      //   ] 
      // },
      // { 
      //   name: 'Users', 
      //   path: './users', 
      //   children: [] 
      // }
    ];

    return menu;
  }
}
