import {Component, OnDestroy, OnInit} from '@angular/core';
import {mergeMap, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {IQuery} from '../../../interfaces/query.interface';
import {faEdit, faTrash, faEnvelopeOpen} from '@fortawesome/free-solid-svg-icons';
import {IPermissionGroup} from "../../../interfaces/permission.group.interface";
import {PermissionGroupService} from "../../../services/permission.group.service";
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {BasicList} from "../../../abstracts/basic.list";
import {ModalComponent} from "../../../helpers/modal/modal.component";
import {PERMISSION_GROUP_SERVICE, SETTING_SERVICE} from "../../../configs/path.constants";
import {take} from "rxjs/operators";


@Component({
  selector: 'app-permission-group-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],

})
export class ListComponent extends BasicList implements OnInit, OnDestroy {
  faIcon = {faEdit, faTrash, faEnvelopeOpen};
  permissionGroupRows!: ResponseObject<IPermissionGroup>;

  constructor(public permissionGroupService: PermissionGroupService,
              private router: Router,
              private modalService: BsModalService,
              protected override activatedRoute: ActivatedRoute
  ) {
    super(activatedRoute);

  }

  ngOnInit(): void {

    this.sortData = [
      {id: 'id', text: 'Id',},
      {id: 'groupId', text: 'Group',},
      {id: 'permissionId', text: 'Permission',}
    ];

    this.activatedRoute.queryParams.pipe(takeUntil(this.subscription$),
      mergeMap((params) => {
        this.permissionGroupService.setQueryArgument(params);
        return this.permissionGroupService.query(params);
      })).subscribe((permission) => {
      this.permissionGroupRows = permission;
      if (permission.pager) {
        this.totalPage = permission.pager!.total;
        this.currentPage = permission.pager!.currentPage;

      }
    });

  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.permissionGroupService.unsubscribe();

  }


  async onEditItem(id: number): Promise<void> {

   await this.router.navigate([PERMISSION_GROUP_SERVICE.edit + id]);
  }

 async onDetailItem(id: number): Promise<void> {

   await this.router.navigate([PERMISSION_GROUP_SERVICE.detail + id]);
  }

  onOpenModal(id: number, index: number): void {


    this.deleteId = id;
    this.deleteIndex = index;
    this.deleteItem = this.permissionGroupRows.data![index].id.toString();
    const initialState: ModalOptions = {
      initialState: {
        deleteItem: this.deleteItem,
      }
    };
    this.modalRef = this.modalService.show(ModalComponent, initialState);
    this.modalRef.content.onClose = new Subject<boolean>();
    this.modalRef.content.onClose.pipe(takeUntil(this.subscription$)).subscribe((result: boolean) => {
      if (result) {
        this.permissionGroupService.remove(this.deleteId);
        this.permissionGroupRows.data!.splice(this.deleteIndex, 1);
      }
    });




  }


  onChangePaginate($event: PageChangedEvent): void {
    this.permissionGroupService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$), take(1)).subscribe((qParams: IQuery) => {
      this.router.navigate([PERMISSION_GROUP_SERVICE.list], {
        queryParams: {...qParams, page: $event.page},
      }).then();
    });
  }


}
