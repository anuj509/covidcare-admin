import { Component, OnInit } from '@angular/core';
import { StatsService } from '@app/services/stats.service';
import { first } from 'rxjs/operators';
import { AlertService } from '@app/services/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {oxygen:0,plasma:0,medicines:0,bed:0};
  constructor(private statsService: StatsService,private alertService: AlertService) {
    this.statsService.getStats()
          .pipe(first())
          .subscribe(
              data => {
                this.stats = data['data'];
              },
              error => {
                this.alertService.error(error); 
              });
   }

  ngOnInit() {
  }

}
