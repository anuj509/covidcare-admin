import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '@app/shared/field.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class SectionTitleComponent implements OnInit {

  field: FieldConfig;
  group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
