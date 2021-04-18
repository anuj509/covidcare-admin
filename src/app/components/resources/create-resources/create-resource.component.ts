import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '@app/services/alert.service';
import { Router } from '@angular/router';
import { Subject, Subscription, ReplaySubject } from 'rxjs';
import { first, takeUntil, take } from 'rxjs/operators';
import { ResourceService } from '@app/services/resource.service';
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
  selector: 'app-create-resource',
  templateUrl: './create-resource.component.html',
  styleUrls: ['./create-resource.component.scss']
})
export class CreateResourceComponent implements OnInit,OnDestroy,AfterViewInit {
  @ViewChild('categorySelect', { static: false }) categorySelect: MatSelect;
  
  resourceForm: FormGroup;
  private _onDestroy = new Subject<void>();
  public categoryFilterCtrl: FormControl = new FormControl();
  resourceSubscription: Subscription;
  private categories: Category[] = [];
  public filteredCategories: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);
  loading = false;
  submitted = false;
  readonly maxSize = 10000;
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private resourceService: ResourceService,
    private router: Router
  ) { 
      this.categories = [{"name":"oxygen"},{"name":"plasma"},{"name":"medicines"},{"name":"beds"},{"name":"other"}];
      // load the initial units list
      this.filteredCategories.next(this.categories.slice());

  }

  ngOnInit() {

    this.categoryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategories();
      });

    this.resourceForm = this.formBuilder.group({
      category: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100),noWhitespaceValidator]],
      location: ['', Validators.required],
      phone: ['', [Validators.required]]
    });
  }
  
  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private setInitialValue() {
    this.filteredCategories
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.categorySelect.compareWith = (a: Category, b: Category) => a.name === b.name;
      });
  }

  private filterCategories() {
    if (!this.categories) {
      return;
    }
    // get the search keyword
    let search = this.categoryFilterCtrl.value;
    if (!search) {
      this.filteredCategories.next(this.categories.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the units
    this.filteredCategories.next(
      this.categories.filter(category => category.name.toLowerCase().indexOf(search) > -1)
    );
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
    console.log(data);
    this.resourceService.resourceCreate(data)
      .pipe(first())
      .subscribe(
        data => {
          //console.log("registered");
          if(data.success){
            this.alertService.success('Resource creation successful', true);
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
