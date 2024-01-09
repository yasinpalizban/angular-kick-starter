import {Component, OnDestroy, OnInit} from '@angular/core';
import {switchMap, takeUntil} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {IQuery} from '../../../interfaces/iquery';
import {IPermissionGroup} from "../../../interfaces/ipermission.group";
import {PermissionGroupService} from "../../../services/permission.group.service";
import {BasicDetail} from "../../../abstracts/basic.detail";
import {PERMISSION_GROUP_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-permission-group-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BasicDetail implements OnInit, OnDestroy {

  permissionGroup!: IPermissionGroup;

  constructor(
    private permissionGroupService: PermissionGroupService,
    private activatedRoute: ActivatedRoute, protected override router: Router) {
    super(router);
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) =>   this.permissionGroupService.detail(+params['id'])
      )).subscribe((value) => {
      this.permissionGroup =value.data;
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
