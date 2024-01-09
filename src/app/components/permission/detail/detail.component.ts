import {Component,  OnDestroy, OnInit} from '@angular/core';
import {switchMap, takeUntil} from 'rxjs';
import {ActivatedRoute,  Router} from '@angular/router';
import {IQuery} from '../../../interfaces/iquery';
import {IPermission} from "../../../interfaces/ipermission";
import {PermissionService} from "../../../services/permission.service";
import {BasicDetail} from "../../../abstracts/basic.detail";
import {PERMISSION_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-permission-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BasicDetail implements OnInit, OnDestroy {

  permission!: IPermission;

  constructor(
    private permissionService: PermissionService,
    private activatedRoute: ActivatedRoute, protected override router: Router) {
    super(router);
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.permissionService.detail(+params['id'])
      )).subscribe((value) => {
      this.permission = value.data;
    });

    this.permissionService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams: IQuery) => {
      this.params = qParams;
      this.path = PERMISSION_SERVICE.base;
    });
  }

  override ngOnDestroy(): void {
    this.permissionService.unsubscribe();
  }
}
