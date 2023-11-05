import {Component, OnInit} from '@angular/core';
import { switchMap, takeUntil} from 'rxjs';
import {ISetting} from '../../../interfaces/isetting.interface';
import {SettingService} from '../../../services/setting.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {IResponseObject} from "../../../interfaces/iresponse.object.interface";
import {BasicDetail} from "../../../abstracts/basic.detail";
import {SETTING_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-setting-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BasicDetail implements OnInit {


  setting!: IResponseObject<ISetting>;

  constructor(
    private settingService: SettingService,
    private activatedRoute: ActivatedRoute,
    protected override router: Router) {
    super(router);
  }

  ngOnInit(): void {

    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.settingService.query(+params['id'])
      )).subscribe((data) => {
      this.setting = data;
    });

    this.settingService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams) => {
      this.params = qParams;
      this.path = SETTING_SERVICE.base;
    });
  }
}

