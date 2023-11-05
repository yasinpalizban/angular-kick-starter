import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription, takeUntil} from 'rxjs';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ProfileService} from '../../../services/profile.service';
import {environment} from '../../../../environments/environment';
import {INotification} from '../../../interfaces/inotification.interface';
import {HeaderService} from '../../../services/header.service';
import {NotificationType} from '../../../enums/notification.enum';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticateService} from '../../../services/authenticate.service';
import {GlobalConstants} from "../../../configs/global-constants";
import {
  faChartArea, faTachometerAlt, faUsers, faList, faAngleDown,
  faUserFriends, faUserPlus, faBlog, faShoppingCart, faNewspaper, faDesktop, faImage,
  faInbox, faComments, faEnvelope, faBookmark, faBell, faBars, faCog, faTools, faUserCircle,
  faGlobe, faLanguage, faSignOutAlt, faFile, faUserCog, faEye, faRandom, faRetweet, faShoppingBag,
  faShoppingBasket, faListAlt, faTable, faSearch, faFileAudio
} from "@fortawesome/free-solid-svg-icons";
import {IAuth} from "../../../interfaces/iauthenticate.interface";
import {MainAbstract} from "../../../abstracts/main.abstract";

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
  limitUserMenu = GlobalConstants.limitUserMenu;
  isRightSidebar: boolean = false;
  isLeftSidebar: boolean = false;
  isLeftArrow: {
    account: boolean; news: boolean, homePage: boolean,
    communication: boolean; dashboard: boolean, setting: boolean,
    product: boolean, room: boolean
  } = {
    account: true,
    news: true,
    homePage: true,
    communication: true,
    dashboard: true,
    setting: true,
    product: true,
    room: true
  };
  isSearch: boolean = false;
  isNotify: boolean = false;
  pathLink: string = '';
  explodeLink: string[] = [];
  links: {
    chat: string,
    profile: string, setting: string, group: string, users: string,
    newsPost: string, advertisement: string,
    contact: string, viewOption: string, visitor: string, request: string, overView: string, graph: string,
    permission: string, userPermission: string, groupPermission: string,
    fastFoodPost: string, fastFoodOrder: string, hotelTransaction: string,
    hotelActivity: string, hotelPost: string, hotelOrder: string
  } = {
    overView: '/admin/dashboard/over-view',
    graph: '/admin/dashboard/graph',
    profile: '/admin/profile',
    setting: '/admin/setting/list',
    group: '/admin/group/list',
    users: '/admin/user/list',
    newsPost: '/admin/news-post/list',
    advertisement: '/admin/advertisement/list',
    contact: '/admin/contact/list',
    viewOption: '/admin/view-option/list',
    visitor: '/admin/visitor/list',
    chat: '/admin/chat/contact',
    request: '/admin/request-post/list',
    permission: '/admin/permission/list',
    userPermission: '/admin/permission-user/list',
    groupPermission: '/admin/permission-group/list',
    fastFoodPost: '/admin/food-post/list',
    fastFoodOrder: '/admin/food-order/list',
    hotelActivity: '/admin/hotel-order/activity',
    hotelPost: '/admin/hotel-post/list',
    hotelOrder: '/admin/hotel-order/list',
    hotelTransaction: '/admin/hotel-transaction/list',

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

  ngOnInit(): void {

    this.headerService.checkUrlParams();
    this.headerService.getExplodeLink().pipe(takeUntil(this.subscription$)).subscribe((value: string[]) => {
      this.explodeLink = value;
    });

    if (localStorage.getItem('user')) {
      const profile: IAuth = JSON.parse(localStorage.getItem('user')!);
      this.image = profile.userInformation?.image!;
      this.userName = profile.userInformation?.userName!;
      this.fullName = profile.userInformation?.email ? profile.userInformation?.firstName! + ' ' + profile.userInformation?.lastName! : profile.userInformation?.phone!;
    } else {
      this.profileService.query().pipe(takeUntil(this.subscription$)).subscribe((profile) => {
        this.userName = profile.data!.username;
        if (this.fullName) {
          this.fullName = profile.data!.firstName + ' ' + profile.data!.lastName;
        }
        if (profile.data!.image != null) {
          this.image = profile.data!.image;
        }
      });

    }

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
    } else if (url.toString().indexOf('public') !== -1) {

      return this.sanitizer.bypassSecurityTrustUrl(environment.siteUrl + url);

    }
    return '';
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

  appendTypeIcon(type: string): any {

    switch (type) {
      case NotificationType.newUser:
        return this.faIcon.faUserPlus;
      case NotificationType.newChat:
        return this.faIcon.faComments;
      case NotificationType.newChatRoom:
        return this.faIcon.faComments;
      case NotificationType.newContact:
        return this.faIcon.faEnvelope;
      case NotificationType.newOrder:
        return this.faIcon.faFile;
      case NotificationType.newRequest:
        return this.faIcon.faBookmark;
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

  public limitUserMenuLink(key: string): boolean {

    const value = this.limitUserMenu[key];
    for (let i = 0; i < value.length; i++) {
      if (value[i] == this.userRole) {
        return true;
      }
    }

    return false;
  }

}
