import { Component, OnInit, EventEmitter, Output, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication.service';
import { User } from '@app/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges{
  currentUser: User;
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  @Output() showHideSideBar: EventEmitter<Boolean> = new EventEmitter();
  constructor(
    public router: Router,
    private authenticationService: AuthenticationService
) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.showHideSideBar.emit(true);
    });
    ////console.log(this.currentUser);
    // if(this.currentUser){
    //   //console.log("constructor showing sidebar");
    //   this.showHideSideBar.emit(true);
    // }
}

  ngOnInit() {
    if(!this.currentUser){
      //console.log("constructor hiding sidebar");
      this.showHideSideBar.emit(false);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log("changes",changes);
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  logout() {
    this.authenticationService.logout();
    this.showHideSideBar.emit(false);
    this.router.navigate(['/login']);
  }

}
