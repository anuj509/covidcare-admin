import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
@Component({
  selector: "app-button",
  template: `
  <mat-card-actions align="end">
    <div class="field-full-width" [formGroup]="group">
    <button type="submit" mat-raised-button color="primary">{{field.label}}</button>
    </div>
  </mat-card-actions>
`,
  styles: [`mat-card-actions{
    margin-bottom: 0px;
    padding: 0px;
  }`]
})
export class ButtonComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
