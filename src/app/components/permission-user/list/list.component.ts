import {Component, OnDestroy, OnInit} from '@angular/core';
import {mergeMap, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute,  Router} from '@angular/router';
import {BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {IQuery} from '../../../interfaces/iquery';
import {faEdit, faTrash, faEnvelopeOpen} from '@fortawesome/free-solid-svg-icons';
import {IPermissionUser} from "../../../interfaces/ipermission.user";
import {PermissionUserService} from "../../../services/permission.user.service";
import {BasicList} from "../../../abstracts/basic.list";
import {ModalComponent} from "../../../commons/modal/modal.component";
import {PERMISSION_USER_SERVICE,  USER_SERVICE} from "../../../configs/path.constants";
import {take} from "rxjs/operators";


@Component({
  selector: 'app-permission-group-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],

})
export class ListComponent extends BasicList implements OnInit, OnDestroy {
  faIcon = {faEdit, faTrash, faEnvelopeOpen};
  permissionUser!: IPermissionUser[];

  constructor(public permissionUserService: PermissionUserService,
              private router: Router,
              private modalService: BsModalService,
              protected override activatedRoute: ActivatedRoute
  ) {
    super(activatedRoute);
  }

  ngOnInit(): void {
    this.sortData = [
      {id: 'id', text: 'Id',},
      {id: 'userId', text: 'User',},
      {id: 'permissionId', text: 'Permission',}
    ];

    this.activatedRoute.queryParams.pipe(takeUntil(this.subscription$),
      mergeMap((params) => {
        this.permissionUserService.setQueryArgument(params);
        return this.permissionUserService.retrieve(params);
      })).subscribe((value) => {
      this.permissionUser = value.data;
      if (value.pager) {
        this.totalPage = value.pager!.total;
        this.currentPage = value.pager!.currentPage + 1;
      }
    });
  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.permissionUserService.unsubscribe();
  }


  async onEditItem(id: number): Promise<void> {
    await this.router.navigate([USER_SERVICE.edit + id]);
  }

  async onDetailItem(id: number): Promise<void> {
    await this.router.navigate([USER_SERVICE.detail + id]);
  }

  onOpenModal(id: number, index: number): void {
    const initialState: ModalOptions = {
      initialState: {
        deleteItem: this.permissionUser[index].permission+'-'+
          this.permissionUser[index].username,
      }
    };
    this.modalRef = this.modalService.show(ModalComponent, initialState);
    this.modalRef.content.onClose = new Subject<boolean>();
    this.modalRef.content.onClose.pipe(takeUntil(this.subscription$)).subscribe((result: boolean) => {
      if (result) {
        this.permissionUserService.remove(id);
        this.permissionUser.splice(index, 1);
      }
    });
  }


  onChangePaginate($event: PageChangedEvent): void {
    this.permissionUserService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$), take(1)).subscribe((qParams: IQuery) => {
      this.router.navigate([PERMISSION_USER_SERVICE.list], {
        queryParams: {...qParams, page: $event.page},
      }).then();
    });
  }

}
