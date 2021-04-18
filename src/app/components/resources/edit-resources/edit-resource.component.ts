import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription, ReplaySubject } from 'rxjs';
import { Resource } from '@app/models/resource';
import { AlertService } from '@app/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material';
import { ResourceService } from '@app/services/resource.service';
import { Category } from '@app/models/category';

function noWhitespaceValidator(control: FormControl) {
  ////console.log(control);
  if (control && control.value && !control.value.replace(/\s/g, '').length) {
    control.setValue('');
  }
  return null;
}

@Component({
  selector: 'app-edit-resource',
  templateUrl: './edit-resource.component.html',
  styleUrls: ['./edit-resource.component.scss']
})
export class EditResourceComponent implements OnInit,OnDestroy {
  @ViewChild('categorySelect', { static: false }) categorySelect: MatSelect;
  resourceForm: FormGroup;
  private _onDestroy = new Subject<void>();
  public categoryFilterCtrl: FormControl = new FormControl();
  resourceSubscription: Subscription;
  private categories: Category[] = [];
  public filteredCategories: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);
  loading = false;
  submitted = false;
  resourceId:number;
  resource:Resource;
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private resourceService: ResourceService,
    private route:ActivatedRoute,
    private router:Router,
  ) {
    this.resourceId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.resourceService.getResource(this.resourceId).subscribe(response =>{
      this.resource = response['data'];
      this.resourceForm.patchValue({
        name: this.resource.name,
        location: this.resource.location,
        phone: this.resource.phone,
      });
      this.categories = [{"name":"oxygen"},{"name":"plasma"},{"name":"medicines"},{"name":"beds"},{"name":"other"}];
      // load the initial units list
      this.filteredCategories.next(this.categories.slice());
      this.resourceForm.controls["category"].setValue(this.resource.category);
    });
   }

  ngOnInit() {
    this.resourceForm = this.formBuilder.group({
      category: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100),noWhitespaceValidator]],
      location: ['', Validators.required],
      phone: ['', [Validators.required]]
    });

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.resourceForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    //console.log("submit");
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.resourceForm.invalid) {
      return;
    }

    this.loading = true;
    let data = this.resourceForm.value;
    //console.log(data);
    data['id']=this.resourceId;
    this.resourceService.resourceUpdate(data)
      .pipe(first())
      .subscribe(
        data => {
          //console.log("registered");
        if(data.success){
          this.alertService.success('Resource updation successful', true);
          this.router.navigate(['/resources']);
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
