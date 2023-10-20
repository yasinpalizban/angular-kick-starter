import {Component, OnDestroy, OnInit} from '@angular/core';
import {mergeMap, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {IQuery} from '../../../interfaces/query.interface';
import {faEdit, faTrash, faEnvelopeOpen} from '@fortawesome/free-solid-svg-icons';
import {IPermissionUser} from "../../../interfaces/permission.user.interface";
import {PermissionUserService} from "../../../services/permission.user.service";
import {BasicList} from "../../../abstracts/basic.list";
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {ModalComponent} from "../../../helpers/modal/modal.component";
import {PERMISSION_USER_SERVICE, SETTING_SERVICE, USER_SERVICE} from "../../../configs/path.constants";
import {take} from "rxjs/operators";


@Component({
  selector: 'app-permission-group-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],

})
export class ListComponent extends BasicList implements OnInit, OnDestroy {
  faIcon = {faEdit, faTrash, faEnvelopeOpen};
  userPermissionRows!: ResponseObject<IPermissionUser>;

  constructor(public userPermissionService: PermissionUserService,
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
        this.userPermissionService.setQueryArgument(params);
        return this.userPermissionService.query(params);
      })).subscribe((permission) => {
      this.userPermissionRows = permission;
      if (permission.pager) {
        this.totalPage = permission.pager!.total;
        this.currentPage = permission.pager!.currentPage + 1;
      }
    });


  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.userPermissionService.unsubscribe();

  }


  async onEditItem(id: number): Promise<void> {
    await this.router.navigate([USER_SERVICE.edit + id]);
  }

  async onDetailItem(id: number): Promise<void> {

    await this.router.navigate([USER_SERVICE.detail + id]);
  }

  onOpenModal(id: number, index: number): void {


    this.deleteId = id;
    this.deleteIndex = index;
    this.deleteItem = this.userPermissionRows.data![index].id.toString();
    const initialState: ModalOptions = {
      initialState: {
        deleteItem: this.deleteItem,
      }
    };
    this.modalRef = this.modalService.show(ModalComponent, initialState);
    this.modalRef.content.onClose = new Subject<boolean>();
    this.modalRef.content.onClose.pipe(takeUntil(this.subscription$)).subscribe((result: boolean) => {
      if (result) {
        this.userPermissionService.remove(this.deleteId);
        this.userPermissionRows.data!.splice(this.deleteIndex, 1);
      }
    });
  }


  onChangePaginate($event: PageChangedEvent): void {

    this.userPermissionService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$), take(1)).subscribe((qParams: IQuery) => {
      this.router.navigate([PERMISSION_USER_SERVICE.list], {
        queryParams: {...qParams, page: $event.page},
      }).then();
    });

  }


}
