import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {HeaderService} from "../../services/header.service";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.scss']
})
export class AdminAreaComponent  implements OnInit, OnDestroy {
  subscription: Subscription;
  direction: string;

  constructor(private headerService: HeaderService) {
    this.subscription = new Subscription();
    this.direction = "ltr";
  }

  ngOnInit(): void {
    this.subscription = this.headerService.getLanguage().subscribe((item) => {
      if (item == 'en') {
        this.direction = 'ltr';
      } else {
        this.direction = 'rtl';
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
