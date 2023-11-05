import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import {SpinnerService} from "../services/spinner.service";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(public spinnerService: SpinnerService, private spinner: NgxSpinnerService) {
  }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.spinnerService.show();
    this.spinner.show().then();
    return next.handle(request).pipe(
      finalize(() => {
        this.spinnerService.hide();
        this.spinner.hide().then();
      })
    );

  }

}

