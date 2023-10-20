import {Component,  OnDestroy, OnInit} from '@angular/core';
import {switchMap, takeUntil} from 'rxjs';
import {ActivatedRoute,  Router} from '@angular/router';
import {IQuery} from '../../../interfaces/query.interface';
import {IPermission} from "../../../interfaces/permission.interface";
import {PermissionService} from "../../../services/permission.service";
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {BasicDetail} from "../../../abstracts/basic.detail";
import {PERMISSION_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-permission-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BasicDetail implements OnInit, OnDestroy {

  permissionDetail!: ResponseObject<IPermission>;

  constructor(
    private permissionService: PermissionService,
    private activatedRoute: ActivatedRoute, protected override router: Router) {
    super(router);

  }

  ngOnInit(): void {

    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.permissionService.query(+params['id'])
      )).subscribe((permission) => {
      this.permissionDetail = permission;
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
