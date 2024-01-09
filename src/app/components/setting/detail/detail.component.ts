import {Component, OnInit} from '@angular/core';
import { switchMap, takeUntil} from 'rxjs';
import {ISetting} from '../../../interfaces/isetting';
import {SettingService} from '../../../services/setting.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BasicDetail} from "../../../abstracts/basic.detail";
import {SETTING_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-setting-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BasicDetail implements OnInit {


  setting!: ISetting;

  constructor(
    private settingService: SettingService,
    private activatedRoute: ActivatedRoute,
    protected override router: Router) {
    super(router);
  }

  ngOnInit(): void {

    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.settingService.detail(+params['id'])
      )).subscribe((value) => {
      this.setting = value.data;
    });

    this.settingService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams) => {
      this.params = qParams;
      this.path = SETTING_SERVICE.base;
    });
  }
}

