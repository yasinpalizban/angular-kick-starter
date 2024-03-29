import {Component, OnDestroy, OnInit} from '@angular/core';
import {switchMap, takeUntil} from 'rxjs';
import {GroupService} from '../../../services/group.service';
import {ActivatedRoute,  Router} from '@angular/router';
import {IQuery} from '../../../interfaces/iquery';
import {IGroup} from '../../../interfaces/igroup';
import {BasicDetail} from "../../../abstracts/basic.detail";
import {GROUP_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-group-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BasicDetail implements OnInit, OnDestroy {
  group!: IGroup;

  constructor(
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute,
    protected override router: Router) {
    super(router);
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.groupService.detail(+params['id'])
      )).subscribe((value) => {
      this.group = value.data;
    });

    this.groupService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams: IQuery) => {
      this.params = qParams;
      this.path = GROUP_SERVICE.base;
    });
  }

  override ngOnDestroy(): void {
    this.groupService.unsubscribe();
  }
}
