import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ToastService} from "../../services/toast.service";
import {ToastModel} from "../../models/toast.model";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  toast: ToastModel = new ToastModel();
  show: boolean = false;

  constructor(private toastService: ToastService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    // subscribe to new alert notifications
    this.subscription = this.toastService.onToast()
      .subscribe(toast => {
        this.toast = toast;
        this.show = true;
        setTimeout(() => this.removeToast(toast), 3000);
      });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  removeToast(alert: ToastModel): void {
    if (!this.toast) {
      return;
    }
    if (alert) {
      setTimeout(() => {
        this.show = false;
      }, 250);
    }
  }

  cssClass(toast: ToastModel): string | void {
    if (!toast) {
      return;
    }
    const classes = ['toast', 'show'];
    return classes.join(' ');
  }


}
