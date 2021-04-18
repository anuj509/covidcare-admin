import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Config } from 'protractor';
import { Columns, DefaultConfig } from 'ngx-easy-table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '@app/services/alert.service';
import { DeleteComponent } from '../delete/delete.component';
import { FeedService } from '@app/services/feed.service';

interface EventObject {
  event: string;
  value: {
    limit: number;
    page: number;
  };
}

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent implements OnInit {
  isVisible = true;
  feeds: any[] = [];
  productSubs: Subscription;
  public configuration: Config;
  public columns: Columns[];
  private _onDestroy = new Subject<void>();
  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
  }; 
  constructor(
    private feedService: FeedService,
    private router:Router,
    public dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.configuration = { ...DefaultConfig };
    this.configuration.orderEnabled = true;
    this.configuration.searchEnabled = true;
    this.configuration.threeWaySort = true;
    this.configuration.rows = 10;
    this.columns = [
      { key: 'name', title: 'Name' },
      { key: 'content', title: 'Content' },
      { key: 'user_id', title: 'UserID' },
      { key: 'id', title: 'Actions',searchEnabled:false }
    ];
    this.getfeeds('');
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  eventEmitted($event: { event: string, value: any }): void {
    if ($event.event !== 'onClick') {
      this.parseEvent($event);
    }
  }

  private parseEvent(obj: EventObject): void {
    this.pagination.limit = obj.value.limit ? obj.value.limit : this.pagination.limit;
    this.pagination.offset = obj.value.page ? obj.value.page : this.pagination.offset;
    this.pagination = { ...this.pagination };
    const params = `limit=${this.pagination.limit}&skip=` + ((this.pagination.offset - 1) * this.pagination.limit); // see https://github.com/typicode/json-server
    this.getfeeds(params);
  }

  getfeeds(params){
    this.configuration.isLoading = true;
    this.productSubs = this.feedService.getAll(params)
    .pipe(takeUntil(this._onDestroy))
    .subscribe(response => {
      this.feeds = response['data'];
      this.pagination.count = (this.pagination.count === -1) ? (response['data'] ? response['data'].length : 0) : this.pagination.count;
      this.pagination = { ...this.pagination };
      this.configuration.isLoading = false;
      this.cdr.detectChanges();
      //console.log(response);
    },(error) => {
      this.alertService.error(error);
    });
  }

  editFeed(feed){
    //console.log("editing",product);
    this.router.navigate(['feeds/edit',feed.id]);
  }

  deleteFeed(feed) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '363px',
      data: {title:"Delete Feed Confirmation",name:"Feed Item"}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed',result);
      if(result){
        this.feedService.deleteFeed(feed.id).subscribe(response => {
          this.getfeeds('');
        });
      }   
    });
  }

}
