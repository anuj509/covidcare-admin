import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from '@app/services/alert.service';
import { PostService } from '@app/services/post.service';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {

  updatePostStatusForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  private statuses = ["pending","inprogress","closed","onhold"];
  private _onDestroy = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<UpdateStatusComponent>,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private postService: PostService,
  ) { }

  ngOnInit() {
    console.log(this.data.post);
    this.updatePostStatusForm = this.formBuilder.group({
      status: [this.data.post.status.split(" by ")[0], [Validators.required]],
      admin_comment: [this.data.post.admin_comment, [Validators.minLength(6),Validators.maxLength(500)]]
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.updatePostStatusForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    //console.log("submit");
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.updatePostStatusForm.invalid) {
      return;
    }

    this.loading = true;
    let data = this.updatePostStatusForm.value;
    //console.log(data);
    this.postService.updatePostStatus({ post_id: this.data.post.id, admin_comment: data.admin_comment, status: data.status }).subscribe(
        data => {
          //console.log("registered");
          if(data.success){
            this.alertService.success('Post Updated Successfully', true);
            this.dialogRef.close(this.updatePostStatusForm.value.status=="closed"?{call:"close"}:{refresh:true});
          }else{
            this.alertService.error(data.message);
            this.loading = false;
          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
