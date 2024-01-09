import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {ToastModel} from "../models/toast.model";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private subject = new Subject<ToastModel>();

  onToast(): Observable<ToastModel> {
    return this.subject.asObservable().pipe(filter(x => x != undefined));
  }

  onToastDelete(message:string): void {
    this.subject.next(new ToastModel({ name:'#_#', message:message, time: new Date().toDateString() }));
  }
  newToast(toastModel: ToastModel): void {
    this.subject.next(toastModel);
  }

  clear(): void {
    this.subject.next(new ToastModel());
  }
}
