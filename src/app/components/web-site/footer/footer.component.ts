import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {HomeService} from "../../../services/home.service";
import { takeUntil} from "rxjs";
import {IHome} from "../../../interfaces/ihome.interface";
import {HeaderService} from "../../../services/header.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {
  faEnvelope, faHome, faPhone, faAngleRight, faAngleUp
} from "@fortawesome/free-solid-svg-icons";
import {faFacebookF, faInstagram, faGooglePlus, faTwitter} from '@fortawesome/free-brands-svg-icons'
import {IResponseObject} from "../../../interfaces/iresponse.object.interface";
import {MainAbstract} from "../../../abstracts/main.abstract";

@Component({
  selector: 'app-website-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent extends MainAbstract implements OnInit, OnDestroy {
  homeRows!: IResponseObject<IHome>;
  faIcon = {
    faEnvelope, faPhone, faHome, faAngleRight,
    faFacebookF, faInstagram, faGooglePlus, faTwitter, faAngleUp
  };

  constructor(private homeService: HomeService,
              private headerService: HeaderService,
              private translate: TranslateService,
              private router: Router) {
    super();

  }

  ngOnInit(): void {
    this.homeService.settingList();

    this.homeService.getDataObservable().pipe(takeUntil(this.subscription$)).subscribe((data) => {

      this.homeRows = data;


    });
  }

  override ngOnDestroy() {
    this.homeService.unsubscribe();
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

    const url = this.router.url.indexOf('?') !== -1 ?
      this.router.url.split('?')[0] : this.router.url;

    switch (url) {
      case  "/home/main":

        break;


    }

  }
}
