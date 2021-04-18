import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '@app/services/menu.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  sideBarOpen = true;
  screenWidth: number;
  name: string;
  menu: Array<any> = [];
  breadcrumbList: Array<any> = [];
  constructor(
    private _router: Router,
    private menuService: MenuService
  ) {
    this.screenWidth = window.innerWidth;
    this.menu = this.menuService.getMenu();
    this.listenRouting();
   }

  ngOnInit() {
    window.onresize = () => {
      //console.log("resize called");
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
    if(this.screenWidth < 850){
      this.sideBarOpen = false;
    }
  }

  sideBarToggler(event) {
    //console.log(event);
    this.sideBarOpen = !this.sideBarOpen;
  }

  showHideSideBar(event) {
    //console.log("sidebar "+((event)?"show":"hide"));
    this.sideBarOpen = event;
  }

  listenRouting() {
    let routerUrl: string, routerList: Array<any>, target: any;
    this._router.events.subscribe((router: any) => {
      routerUrl = router.urlAfterRedirects;
      // //console.log("routerurl",routerUrl);
      if (routerUrl && typeof routerUrl === 'string') {
        // Initialize breadcrumb
        target = this.menu;
        this.breadcrumbList.length = 0;
        // Get the current routing URL / zone, [0] = first layer, [1] = second layer ... etc

        if(routerUrl!='/login'){
          routerList = routerUrl.slice(1).split('/');
          routerList.forEach((router, index) => {
            if(isNaN(router)){
              // Find the path of this layer in the menu and the same path as the current routing
              target = target.find(page => page.path.slice(2) === router);
              // After saving to the breadcrumbList, the list will be looped directly after the time is up.
              if(target){
                this.breadcrumbList.push({
                  name: target.name,
                  // The routing of the second layer must be added to the routing of the previous layer. Using relative positions will cause routing errors.
                  path: (index === 0) ? target.path : `${this.breadcrumbList[index-1].path}/${target.path.slice(2)}`
                });
              }
              
              // The target of the next layer to be compared is the subpage specified by this layer
              if (index+1 !== routerList.length) {
                target = target.children;
              }
            }
          });
        }

        // //console.log(this.breadcrumbList);
      }
    });
  }

}
