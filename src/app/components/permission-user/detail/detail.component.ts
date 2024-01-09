import {Component,  OnDestroy, OnInit} from '@angular/core';
import {switchMap, takeUntil} from 'rxjs';
import {ActivatedRoute,  Router} from '@angular/router';
import {IQuery} from '../../../interfaces/iquery';
import {IPermissionUser} from "../../../interfaces/ipermission.user";
import {PermissionUserService} from "../../../services/permission.user.service";
import {BasicDetail} from "../../../abstracts/basic.detail";
import {USER_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-permission-group-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BasicDetail implements OnInit, OnDestroy {

  permissionGroup!: IPermissionUser;

  constructor(
    private userPermissionService: PermissionUserService,
    private activatedRoute: ActivatedRoute, protected override router: Router) {
    super(router);

  }

  ngOnInit(): void {

    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) =>       this.userPermissionService.detail(+params['id'])
      )).subscribe((value) => {
      this.permissionGroup = value.data;
    });

    this.userPermissionService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams: IQuery) => {
      this.params = qParams;
      this.path= USER_SERVICE.base;
    });
  }

  override ngOnDestroy(): void {
    this.userPermissionService.unsubscribe();
  }
}
