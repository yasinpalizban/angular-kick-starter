import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, takeUntil} from "rxjs";
import {HeaderService} from "../../services/header.service";
import {MainAbstract} from "../../abstracts/main.abstract";
import {TranslateService} from "@ngx-translate/core";
import {faList} from "@fortawesome/free-solid-svg-icons";
import {fixControllerName} from "../../utils/fix.controller.name";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.scss']
})
export class AdminAreaComponent extends MainAbstract implements OnInit, OnDestroy {
  subscription: Subscription;
  direction: string;
  faIcon = {faList};


  constructor(private headerService: HeaderService,
              private translate: TranslateService) {
    super();
    this.subscription = new Subscription();
    this.direction = "ltr";
  }

  ngOnInit(): void {
    this.subscription = this.headerService.getLanguage().pipe(takeUntil(this.subscription$)).subscribe((item) => {
      if (item == 'en') {
        this.direction = 'ltr';
      } else {
        this.direction = 'rtl';
      }
    });
    this.headerService.getUrlPath().pipe(takeUntil(this.subscription$)).subscribe(async url => {
      this.component = url;
    });
    this.headerService.getExplodeLink().pipe(takeUntil(this.subscription$)).subscribe(async explod => {
      this.controller = fixControllerName(explod[1]?.toLowerCase());

    });
  }

  ngDoCheck(): void {
    this.onChangeTitle();
  }

  onChangeTitle(): void {
    this.title = this.translate.instant(`${this.controller}.${this.component}`);
  }

  override ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkValidToShow(type: string): boolean {
    let flag = false;

    const arrayItem = ['dashboard', 'request-reply', 'chat'];
    arrayItem.map((item) => {
      if (item == this.controller) {
        flag = true;
      }
    });
    if ('typeOne' == type && flag) {
      return true;
    } else if (type == 'typeTwo' && !flag) {
      return true;
    }

    return false;
  }
}
