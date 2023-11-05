import {AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription, takeUntil} from "rxjs";
import {HomeService} from "../../services/home.service";
import {IHome} from "../../interfaces/ihome.interface";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {
  faUser, faCalendarAlt, faStar, faBook, faBookReader,
  faCertificate, faTasks, faPuzzlePiece, faUniversity,
  faBicycle, faShieldAlt, faGraduationCap, faCar, faSearch,
  faEllipsisH
} from "@fortawesome/free-solid-svg-icons";
import {HeaderService} from "../../services/header.service";
import {faFacebookF, faGooglePlus, faInstagram, faTwitter} from "@fortawesome/free-brands-svg-icons";

import {IQuery} from "../../interfaces/iquery.interface";
import {MainAbstract} from "../../abstracts/main.abstract";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent extends MainAbstract implements OnInit, OnDestroy {

  siteUrl = environment.siteUrl;

  faIcon = {
    faUser, faCalendarAlt, faStar, faBook, faFacebookF, faInstagram,
    faGooglePlus, faTwitter, faCertificate, faBookReader, faTasks, faPuzzlePiece,
    faBicycle, faUniversity, faShieldAlt, faGraduationCap, faEllipsisH, faCar, faSearch
  };
  direction: string = "ltr";

  constructor(private homeService: HomeService,
              private sanitizer: DomSanitizer,
              private headerService: HeaderService
  ) {
    super();

  }

  ngOnInit(): void {

    this.headerService.getLanguage().pipe(takeUntil(this.subscription$)).subscribe((item) => {
      if (item == 'en') {
        this.direction = 'ltr';
      } else {
        this.direction = 'rtl';
      }
    });

    // this.homeService.visitorSave();

  }

  public getSantizeUrl(url: SafeUrl | string | undefined): SafeUrl | string | undefined {

    if (url?.toString().indexOf('assets') !== -1 || typeof url == undefined) {
      return "assets/images/icon/404.png";
    } else if (url?.toString().indexOf('public') !== -1) {

      return this.sanitizer.bypassSecurityTrustUrl(environment.siteUrl + url);

    } else {
      return undefined;
    }
  }

  trimArray(array: any, start: number, end: number): any {
    return array?.data?.slice(start, end);
  }

}
