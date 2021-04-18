import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpEventType } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { AuthenticationService } from '@app/services/authentication.service';
import { mergeMap } from 'rxjs/operators';
import { LoaderService } from '@app/services/loader.service';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,private loaderService:LoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.access_token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.access_token}`,
                    //'Access-Control-Allow-Origin': '*'
                }
            });
        }

        return new Observable(observer => {
            const subscription = next.handle(request)
            .subscribe(
                event => {
                //   console.log(event);
                  observer.next(event);
                  // const percentDone = Math.round((event['loaded'] / event['total'])*100);
                  // if(event.type==1){
                  //   this.loaderService.progress.next(percentDone);
                  // }
                },
                err => {
                  observer.error(err);
                },
                () => {
                  observer.complete();
                });
            // remove request from queue when cancelled
            return () => {
              subscription.unsubscribe();
            };
          });
    }
}