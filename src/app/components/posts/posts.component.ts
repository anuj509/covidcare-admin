import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Config, Columns, DefaultConfig } from 'ngx-easy-table';
import { PostService } from '@app/services/post.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AlertService } from '@app/services/alert.service';
import { takeUntil } from 'rxjs/operators';
import { DeleteComponent } from '../delete/delete.component';
import { UpdateStatusComponent } from './update-status/update-status.component';

interface EventObject {
  event: string;
  value: {
    limit: number;
    page: number;
  };
}


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {
  isVisible = true;
  posts: any[] = [];
  postSubs: Subscription;
  public configuration: Config;
  public columns: Columns[];
  private _onDestroy = new Subject<void>();
  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
  };
  constructor(
    private postService: PostService,
    private router: Router,
    public dialog: MatDialog,
    private alertService: AlertService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.configuration = { ...DefaultConfig };
    this.configuration.orderEnabled = true;
    this.configuration.searchEnabled = true;
    this.configuration.threeWaySort = true;
    this.configuration.rows = 10;
    this.columns = [
      { key: 'name', title: 'Name' },
      { key: 'dob', title: 'DOB' },
      { key: 'gender', title: 'Gender' },
      { key: 'blood_group', title: 'Blood Group' },
      { key: 'oxygen_level', title: 'Oxygen Level' },
      { key: 'poc_name', title: 'POC' },
      { key: 'patient_currently_admitted_at', title: 'Patient Currently Admitted At' },
      { key: 'ward', title: 'Ward' },
      { key: 'requirement', title: 'Requirement' },
      { key: 'status', title: 'Status' },
      { key: "admin_comment", title: "Admin Comment" },
      { key: 'id', title: 'Action', searchEnabled: false },
    ];
    this.getPosts('');
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
    console.log(obj, this.pagination.offset);
    this.pagination = { ...this.pagination };
    const params = `limit=${this.pagination.limit}&skip=` + ((this.pagination.offset - 1) * this.pagination.limit); // see https://github.com/typicode/json-server
    //console.log(params);
    this.getPosts(params);
  }

  getPosts(params: string) {
    this.configuration.isLoading = true;
    this.postSubs = this.postService.getAll(params)
      .pipe(takeUntil(this._onDestroy))
      .subscribe(response => {
        this.posts = response['data'];
        this.pagination.count = (this.pagination.count === -1) ? (response['data'] ? response['data'].length : 0) : this.pagination.count;
        this.pagination = { ...this.pagination };
        this.configuration.isLoading = false;
        this.cdr.detectChanges();
      }, (error) => {
        this.alertService.error(error);
      });
  }

  deletePost(post) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '363px',
      data: { title: "Delete Post Confirmation", name: post.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed',result);
      if (result) {
        this.postService.deletePost(post.id).subscribe(response => {
          this.getPosts('');
        });
      }
    });
  }

  closePost(post) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '363px',
      data: { title: "Close Post Confirmation", warningText: "Are you sure you want to close this post", name: post.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed',result);
      if (result) {
        this.postService.closePost(post, { post_id: post.id, comment: "closed by admin", marked_by_user: false }).subscribe(response => {
          this.getPosts('');
        });
      }
    });
  }

  updatePostStatus(post) {
    const dialogRef = this.dialog.open(UpdateStatusComponent, {
      width: '363px',
      data: { post: post }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if (result.refresh) {
        this.getPosts('');
      }else if(result.call=="close"){
        this.postService.closePost(post, { post_id: post.id, comment: "closed by admin", marked_by_user: false }).subscribe(response => {
          this.getPosts('');
        });
      }
    });
  }

  formatRequirement(row, requirement) {
    // console.log(row,requirement);
    var html = "";
    requirement.forEach(key => {
      // console.log(row[key]);
      if (row[key] && key != "other" && Array.isArray(row[key])) {
        var req = row[key].map(function (elem) { var keys = Object.keys(elem); return keys[0] + " : " + elem[keys[0]]; });
        // console.log(req);
        html = html + '<span>' + key + '<br> (' + req + ')</span><br>';
      }
      // if(row[key] && key!="other" && !Array.isArray(row[key])){
      //     console.log(row[key]);
      //     var keys = Object.keys(row[key]);
      //     var req = keys.map(function(elem){ return elem+":"+row[key][elem]}).join(",");
      //     // console.log(req);
      //     html = html + '<span>'+key+'=>'+req+'</span><br>';
      // }
      else if (row[key] && key == "other") {
        var req = row[key];
        html = html + '<span>' + key + '<br> (' + req + ')</span><br>';
      }
    });
    return html;
  }
}
