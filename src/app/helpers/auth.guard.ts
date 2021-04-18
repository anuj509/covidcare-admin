import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/services/authentication.service';
import { AlertService } from '@app/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService:AlertService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const currentUser = this.authenticationService.currentUserValue;
      if (currentUser) {
        ////console.log("in current user if",route.data['permissionName'],this.hasRequiredPermission(route.data['permissionName']));
        
        //   if(route.data['permissionName']){
        //     if(!this.hasRequiredPermission(route.data['permissionName'])){
        //       this.alertService.error("Unauthorized");
        //       // not logged in so redirect to login page with the return url
        //       this.router.navigate(['/home']);
        //       return false;
        //     }
        //   }
        // logged in so return true
        return true;
      }
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
  }

}
