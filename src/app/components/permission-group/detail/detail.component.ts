import {Component, OnDestroy, OnInit} from '@angular/core';
import {switchMap, takeUntil} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {IQuery} from '../../../interfaces/iquery.interface';
import {IPermissionGroup} from "../../../interfaces/ipermission.group.interface";
import {PermissionGroupService} from "../../../services/permission.group.service";
import {IResponseObject} from "../../../interfaces/iresponse.object.interface";
import {BasicDetail} from "../../../abstracts/basic.detail";
import {PERMISSION_GROUP_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-permission-group-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BasicDetail implements OnInit, OnDestroy {

  permissionGroup!: IResponseObject<IPermissionGroup>;

  constructor(
    private permissionGroupService: PermissionGroupService,
    private activatedRoute: ActivatedRoute, protected override router: Router) {
    super(router);
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) =>   this.permissionGroupService.query(+params['id'])
      )).subscribe((data) => {
      this.permissionGroup =data;
    });

    this.permissionGroupService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams: IQuery) => {
      this.params = qParams;
      this.path= PERMISSION_GROUP_SERVICE.base;
    });
  }

  override ngOnDestroy(): void {
    this.permissionGroupService.unsubscribe()
  }
}
