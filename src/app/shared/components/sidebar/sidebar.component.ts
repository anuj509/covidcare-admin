import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '@app/services/authentication.service';
import { User } from '@app/models/user';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentUser: User;
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  screenWidth: number;
  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });

    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
   }

  ngOnInit() {
  }

  toggleSideBar() {
    if(this.screenWidth < 850){
      this.toggleSideBarForMe.emit();
      setTimeout(() => {
        window.dispatchEvent(
          new Event('resize')
        );
      }, 300);
    }
  }

}
