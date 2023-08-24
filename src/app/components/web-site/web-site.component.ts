import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from "../../services/header.service";
import {Subscription} from "rxjs";
import * as $ from "jquery";

@Component({
  selector: 'app-web-site',
  templateUrl: './web-site.component.html',
  styleUrls: ['./web-site.component.scss']
})
export class WebSiteComponent implements OnInit, OnDestroy , AfterViewInit{
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

ngAfterViewInit() {
  $(".ms_nav_close").on('click', function() {
    $(".ms_sidemenu_wrapper").toggleClass('open_menu');
  });

}
}
