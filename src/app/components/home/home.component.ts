import {AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from "rxjs";
import {HomeService} from "../../services/home.service";
import {IHome} from "../../interfaces/home.interface";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {
  faUser, faCalendarAlt, faStar, faBook, faBookReader,
  faCertificate, faTasks, faPuzzlePiece, faUniversity,
  faBicycle, faShieldAlt, faGraduationCap,faCar,faSearch,
  faEllipsisH
} from "@fortawesome/free-solid-svg-icons";
import {HeaderService} from "../../services/header.service";
import {faFacebookF, faGooglePlus, faInstagram, faTwitter} from "@fortawesome/free-brands-svg-icons";

import {IQuery} from "../../interfaces/query.interface";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription: Subscription[];
  siteUrl = environment.siteUrl;

  faIcon = {
    faUser, faCalendarAlt, faStar, faBook, faFacebookF, faInstagram,
    faGooglePlus, faTwitter, faCertificate, faBookReader, faTasks, faPuzzlePiece,
    faBicycle, faUniversity, faShieldAlt, faGraduationCap, faEllipsisH,faCar,faSearch
  };

  direction: string;


  constructor(private  homeService: HomeService,
              private sanitizer: DomSanitizer,
              private headerService: HeaderService
  ) {
    this.subscription = [new Subscription()];
    this.direction = "ltr";

  }

  ngOnInit(): void {

    this.subscription.push(this.headerService.getLanguage().subscribe((item) => {
      if (item == 'en') {
        this.direction = 'ltr';
      } else {
        this.direction = 'rtl';
      }
    }));

    // this.homeService.visitorSave();

    this.subscription.push(this.homeService.getDataObservable().subscribe((data: IHome) => {

    }));

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

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  trimArray(array:any,start: number, end: number): any {

    return array?.data?.slice(start, end );
  }

}
