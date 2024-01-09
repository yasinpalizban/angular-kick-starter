import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ProfileService} from '../../../services/profile.service';
import {environment} from '../../../../environments/environment';
import {INotification} from '../../../interfaces/inotification';
import {HeaderService} from '../../../services/header.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticateService} from '../../../services/authenticate.service';
import {
  faChartArea, faTachometerAlt, faUsers, faList, faAngleDown,
  faUserFriends, faUserPlus, faBlog, faShoppingCart, faNewspaper, faDesktop, faImage,
  faInbox, faComments, faEnvelope, faBookmark, faBell, faBars, faCog, faTools, faUserCircle,
  faGlobe, faLanguage, faSignOutAlt, faFile, faUserCog, faEye, faRandom, faRetweet, faShoppingBag,
  faShoppingBasket, faListAlt, faTable, faSearch, faFileAudio
} from "@fortawesome/free-solid-svg-icons";
import {IAuth} from "../../../interfaces/iauthenticate";
import {MainAbstract} from "../../../abstracts/main.abstract";
import {IMenuLink} from "../../../interfaces/imenu.link";
import {IMenuArrow} from "../../../interfaces/imenu.arrow";

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

})
export class HeaderComponent extends MainAbstract implements OnInit, OnDestroy {
  faIcon = {
    faChartArea, faTachometerAlt, faUsers, faList, faAngleDown,
    faUserFriends, faUserPlus, faBlog, faShoppingCart, faNewspaper, faDesktop, faImage,
    faComments, faInbox, faEnvelope, faBookmark, faBell, faBars, faCog, faTools, faUserCircle,
    faGlobe, faLanguage, faSignOutAlt, faFile, faUserCog, faEye, faRandom, faRetweet,
    faShoppingBasket, faListAlt, faTable, faSearch, faFileAudio
  };

  isRightSidebar: boolean = false;
  isLeftSidebar: boolean = false;
  isLeftArrow: IMenuArrow = {
    account: true,
    homePage: true,
    dashboard: true,
    setting: true,
  };
  isSearch: boolean = false;
  isNotify: boolean = false;
  pathLink: string = '';
  explodeLink: string[] = [];
  links: IMenuLink = {
    overView: '/admin/dashboard/over-view',
    graph: '/admin/dashboard/graph',
    profile: '/admin/profile',
    setting: '/admin/setting/list',
    group: '/admin/group/list',
    users: '/admin/user/list',
    permission: '/admin/permission/list',
    permissionUser: '/admin/permission-user/list',
    permissionGroup: '/admin/permission-group/list',
  };
  userName: string = 'NotSet';
  fullName: string = 'NotSet';
  image: SafeUrl | string = 'assets/images/icon/default-avatar.jpg';
  notify: INotification[] = [];
  url!: string;
  userRole: string;

  constructor(private authService: AuthenticateService,
              private router: Router,
              private aRoute: ActivatedRoute,
              private profileService: ProfileService,
              private sanitizer: DomSanitizer,
              private headerService: HeaderService,
              private translate: TranslateService) {
    super();
    this.pathLink = this.router.url;
    this.userRole = this.authService.authChange.value.role?.name!;
  }

  initMenuProfile(): void {
    if (localStorage.getItem('user')) {
      const profile: IAuth = JSON.parse(localStorage.getItem('user')!);
      this.image = profile.userInformation?.image!;
      this.userName = profile.userInformation?.userName!;
      this.fullName = profile.userInformation?.email ? profile.userInformation?.firstName! + ' ' + profile.userInformation?.lastName! : profile.userInformation?.phone!;
    } else {
      this.profileService.retrieve().pipe(takeUntil(this.subscription$)).subscribe((profile) => {
        this.userName = profile.data!.username;
        if (this.fullName) {
          this.fullName = profile.data!.firstName + ' ' + profile.data!.lastName;
        }
        if (profile.data!.image != null) {
          this.image = profile.data!.image;
        }
      });

    }

  }

  initData(): void {
    this.headerService.checkUrlParams();
    this.headerService.getExplodeLink().pipe(takeUntil(this.subscription$)).subscribe((value: string[]) => {
      this.explodeLink = value;
    });

    this.headerService.checkNotification();
    this.headerService.getNewNotification().pipe(takeUntil(this.subscription$))
      .subscribe((notify: INotification) => {
        if (Object.keys(notify).length) {
          const index = this.notify.findIndex(no => no.type === notify.type);
          index >= 0 ? this.notify[index].counter! += 1 : this.notify.push(notify);
          this.notify.sort((a, b) => 0 - (a.counter! > b.counter! ? 1 : -1));
        }
      });
  }

  ngOnInit(): void {
    this.initMenuProfile();
    this.initData();
  }

  toggleDropDown(name: string): void {
    if (name === 'search') {
      this.isSearch = !this.isSearch;
      this.isNotify = false;
      this.isRightSidebar = false;
      this.isLeftSidebar = false;
    } else if (name === 'notify') {
      this.isNotify = !this.isNotify;
      this.isSearch = false;
      this.isRightSidebar = false;
      this.isLeftSidebar = false;
    } else if (name === 'rightSideBar') {
      this.isRightSidebar = !this.isRightSidebar;
      this.isSearch = false;
      this.isNotify = false;
      this.isLeftSidebar = false;
    } else {
      this.isRightSidebar = false;
      this.isSearch = false;
      this.isNotify = false;
      this.isLeftSidebar = !this.isLeftSidebar;
    }
  }

  onSignOut(): void {
    this.authService.signOut();
  }

  override ngOnDestroy(): void {
    this.profileService.unsubscribe();
    this.headerService.unsubscribe();

  }

  public getSantizeUrl(url: SafeUrl | string): SafeUrl | string {
    if (url.toString().indexOf('assets') !== -1) {
      return this.image;
    } else  {
      return this.sanitizer.bypassSecurityTrustUrl(environment.siteUrl + url);
    }
  }

  appendColorIndex(index: number): string {
    index++;
    if (index <= 6) {
      return 'bg-flat-color-' + index;
    } else if (index % 6 > 0) {
      return 'bg-flat-color-' + index % 6;
    } else {
      return 'bg-flat-color-' + 6;
    }
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
  }

}
