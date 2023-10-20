import {Component, OnDestroy, OnInit} from '@angular/core';
import {switchMap, takeUntil} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {IQuery} from '../../../interfaces/query.interface';
import {IUser} from '../../../interfaces/user.interface';
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {BasicDetail} from "../../../abstracts/basic.detail";
import {USER_SERVICE} from "../../../configs/path.constants";


@Component({
  selector: 'app-user-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BasicDetail implements OnInit, OnDestroy {
  userDetail!: ResponseObject<IUser>;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute, protected override router: Router) {
    super(router);

  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) =>  this.userService.query(+params['id'])
      )).subscribe((user) => {
      this.userDetail = user;
    });


    this.userService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams: IQuery) => {
      this.params = qParams;
      this.path = USER_SERVICE.base;
    });
  }

}
