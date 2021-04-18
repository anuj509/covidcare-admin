import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '@app/services/alert.service';
import { Router } from '@angular/router';
import { Subject, Subscription, ReplaySubject } from 'rxjs';
import { first, takeUntil, take } from 'rxjs/operators';
import { UserService } from '@app/services/user.service';
import { MatSelect } from '@angular/material';
import { Category } from '@app/models/category';

function noWhitespaceValidator(control: FormControl) {
  ////console.log(control);
  if (control && control.value && !control.value.replace(/\s/g, '').length) {
    control.setValue('');
  }
  return null;
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit,OnDestroy,AfterViewInit {
  
  userForm: FormGroup;
  private _onDestroy = new Subject<void>();
  userSubscription: Subscription;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {

    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100),noWhitespaceValidator]],
      email: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }
  
  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    //console.log("submit");
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    let data = this.userForm.value;
    console.log(data);
    this.userService.userCreate(data)
      .pipe(first())
      .subscribe(
        data => {
          //console.log("registered");
          if(data.success){
            this.alertService.success('User creation successful', true);
            this.router.navigate(['/users']);
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
