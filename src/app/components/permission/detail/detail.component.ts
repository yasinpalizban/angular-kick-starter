import {Component,  OnDestroy, OnInit} from '@angular/core';
import {switchMap, takeUntil} from 'rxjs';
import {ActivatedRoute,  Router} from '@angular/router';
import {IQuery} from '../../../interfaces/iquery.interface';
import {IPermission} from "../../../interfaces/ipermission.interface";
import {PermissionService} from "../../../services/permission.service";
import {IResponseObject} from "../../../interfaces/iresponse.object.interface";
import {BasicDetail} from "../../../abstracts/basic.detail";
import {PERMISSION_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-permission-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BasicDetail implements OnInit, OnDestroy {

  permission!: IResponseObject<IPermission>;

  constructor(
    private permissionService: PermissionService,
    private activatedRoute: ActivatedRoute, protected override router: Router) {
    super(router);
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.permissionService.query(+params['id'])
      )).subscribe((data) => {
      this.permission = data;
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
