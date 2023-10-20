import {Component, DoCheck, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {faBars, faCalendarAlt, faAngleDown, faHome, faSignInAlt, faNewspaper} from "@fortawesome/free-solid-svg-icons";
import {Subscription} from "rxjs";

import {HomeService} from "../../../services/home.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-website-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {
  faIcon = {faBars, faCalendarAlt, faAngleDown, faHome, faSignInAlt, faNewspaper};
  buttonBars: boolean = false;
  menu: { home: boolean, music: boolean, contact: boolean, blog: boolean, signIn: boolean,
  } = {signIn: false, home: false, music: false, blog: false, contact: false,}

  constructor(private router: Router
    , private homeService: HomeService,
              private sanitizer: DomSanitizer,
              private headerService: HeaderService,
              private translate: TranslateService,) {

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

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

  menuList(name: string) {
    this.menu = {
      signIn: false,
      home: false,
      music: false,
      blog: false,
      contact: false,
    }

    switch (name) {
      case "blog":
        this.menu.blog = true;
        break;
      case "music":
        this.menu.music = true;
        break;

      case "home":
        this.menu.home = true;
        break;

      case "signIn":
        this.menu.signIn = true;
        break;
      case "contact":
        this.menu.contact = true;
        break;
    }
  }
}
