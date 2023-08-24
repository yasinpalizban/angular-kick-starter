import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {HomeService} from "../../../services/home.service";
import {Subscription} from "rxjs";
import {IHome} from "../../../interfaces/home.interface";
import {HeaderService} from "../../../services/header.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {faEnvelope, faHome, faPhone, faAngleRight,faAngleUp
} from "@fortawesome/free-solid-svg-icons";
import {faFacebookF, faInstagram, faGooglePlus, faTwitter} from '@fortawesome/free-brands-svg-icons'

@Component({
  selector: 'app-website-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit, OnDestroy {
  homeRows!: IHome["settingPost"];
  subscription: Subscription;
  faIcon = {faEnvelope, faPhone, faHome, faAngleRight,
    faFacebookF, faInstagram, faGooglePlus, faTwitter,faAngleUp};
  constructor(private homeService: HomeService,
              private headerService: HeaderService,
              private translate: TranslateService,
              private router: Router) {
    this.subscription = new Subscription();


  }

  ngOnInit(): void {
    this.homeService.settingList();

    this.subscription = this.homeService.getDataObservable().subscribe((data: IHome) => {
      if (data.settingPost)
        this.homeRows = data.settingPost;


    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeLanguage(): void {

    if (localStorage.getItem('lang') === 'en') {
      localStorage.setItem('lang', 'fa');
      this.translate.use('fa');
      this.headerService.setLanguage('fa');
    } else if (localStorage.getItem('lang') === 'fa') {
      localStorage.setItem('lang', 'en');
      this.translate.use('en');
      this.headerService.setLanguage('en');
    }

  const url = this.router.url.indexOf('?')!==-1?
   this.router.url.split('?')[0]: this.router.url;

    switch (url) {
      case  "/home/main":

        break;



    }

  }
}
