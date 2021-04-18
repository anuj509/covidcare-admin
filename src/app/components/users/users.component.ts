import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Config, Columns, DefaultConfig } from 'ngx-easy-table';
import { UserService } from '@app/services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AlertService } from '@app/services/alert.service';
import { takeUntil } from 'rxjs/operators';
import { DeleteComponent } from '../delete/delete.component';

interface EventObject {
  event: string;
  value: {
    limit: number;
    page: number;
  };
}


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  isVisible = true;
  users: any[] = [];
  userSubs: Subscription;
  public configuration: Config;
  public columns: Columns[];
  private _onDestroy = new Subject<void>();
  public pagination = {
    limit: 5,
    offset: 0,
    count: -1,
  };
  constructor(
    private userService: UserService,
    private router:Router,
    public dialog: MatDialog,
    private alertService: AlertService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.configuration = { ...DefaultConfig };
    this.configuration.orderEnabled = true;
    this.configuration.searchEnabled = true;
    this.configuration.threeWaySort = true;
    this.configuration.rows = 4;
    this.columns = [
      { key: 'first_name', title: 'First Name' },
      { key: 'last_name', title: 'Last Name' },
      { key: 'birthdate', title: 'Birth Date' },
      { key: 'email', title: 'Email' },
      { key: 'phone', title: 'Phone' }
    ];
    this.getUsers('');
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  eventEmitted($event: { event: string, value: any }): void {
    if ($event.event !== 'onClick') {
      //console.log($event);
      this.parseEvent($event);
    }
  }

  private parseEvent(obj: EventObject): void {
    this.pagination.limit = obj.value.limit ? obj.value.limit : this.pagination.limit;
    this.pagination.offset = obj.value.page ? obj.value.page : this.pagination.offset;
    //console.log(obj,this.pagination.offset);
    this.pagination = { ...this.pagination };
    const params = `limit=${this.pagination.limit}&skip=`+((this.pagination.offset-1)*this.pagination.limit); // see https://github.com/typicode/json-server
    //console.log(params);
    this.getUsers(params);
  }

  getUsers(params:string){
    this.configuration.isLoading =true;
    this.userSubs = this.userService.getAll(params)
    .pipe(takeUntil(this._onDestroy))
    .subscribe(response => {
      this.users = response['data'];
      this.pagination.count = (this.pagination.count === -1) ? (response['data'] ? response['data'].length : 0) : this.pagination.count;
      this.pagination = { ...this.pagination };
      this.configuration.isLoading = false;
      this.cdr.detectChanges();
    },(error)=>{
      this.alertService.error(error);
    });
  }
}
