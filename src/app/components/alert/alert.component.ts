import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '@app/services/alert.service';
import { ToastrService } from 'ngx-toastr';


@Component({ selector: 'alert', templateUrl: 'alert.component.html' })
export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(
        private alertService: AlertService,
        private toastr: ToastrService
        ) { }

    ngOnInit() {
        this.subscription = this.alertService.getAlert()
            .subscribe(message => {
                switch (message && message.type) {
                    case 'success':
                        //message.cssClass = 'alert alert-success';
                        this.showSuccess(message.text);
                        break;
                    case 'error':
                        //message.cssClass = 'alert alert-danger';
                        this.showError(message.text);
                        break;
                }

                this.message = message;
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    showSuccess(message) {
        this.toastr.success(message, 'Success');
    }

    showError(message) {
        this.toastr.error(message, 'Error');
    }


}