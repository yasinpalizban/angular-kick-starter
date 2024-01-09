import {Component, OnDestroy, OnInit} from '@angular/core';
import {mergeMap, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {IQuery} from '../../../interfaces/iquery';
import {faEdit, faTrash, faEnvelopeOpen} from '@fortawesome/free-solid-svg-icons';
import {IPermission} from "../../../interfaces/ipermission";
import {PermissionService} from "../../../services/permission.service";
import {IResponseObject} from "../../../interfaces/iresponse.object";
import {BasicList} from "../../../abstracts/basic.list";
import {ModalComponent} from "../../../commons/modal/modal.component";
import {PERMISSION_SERVICE} from "../../../configs/path.constants";
import {take} from "rxjs/operators";


@Component({
  selector: 'app-permission-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],

})
export class ListComponent extends BasicList implements OnInit, OnDestroy {
  faIcon = {faEdit, faTrash, faEnvelopeOpen};
  permission!: IPermission[];

  constructor(public permissionService: PermissionService,
              private router: Router,
              private modalService: BsModalService,
              protected override activatedRoute: ActivatedRoute
  ) {
    super(activatedRoute);
  }

  ngOnInit(): void {
    this.sortData = [
      {id: 'id', text: 'Id',},
      {id: 'name', text: 'Name',},
      {id: 'active', text: 'Active',}
    ];

    this.activatedRoute.queryParams.pipe(takeUntil(this.subscription$),
      mergeMap((params) => {
        this.permissionService.setQueryArgument(params);
        return this.permissionService.retrieve(params);
      })).subscribe((value) => {
      this.permission = value.data;
      if (value.pager) {
        this.totalPage = value.pager!.total;
        this.currentPage = value.pager!.currentPage + 1;
      }
    });
  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.permissionService.unsubscribe();
  }


  async onEditItem(id: number): Promise<void> {
    await this.router.navigate([PERMISSION_SERVICE.edit + id]);
  }

  async onDetailItem(id: number): Promise<void> {
    await this.router.navigate([PERMISSION_SERVICE.detail + id]);
  }

  onOpenModal(id: number, index: number): void {
    const initialState: ModalOptions = {
      initialState: {
        deleteItem: this.permission[index].name
      }
    };
    this.modalRef = this.modalService.show(ModalComponent, initialState);
    this.modalRef.content.onClose = new Subject<boolean>();
    this.modalRef.content.onClose.pipe(takeUntil(this.subscription$)).subscribe((result: boolean) => {
      if (result) {
        this.permissionService.remove(id);
        this.permission.splice(index, 1);
      }
    });
  }

  onChangePaginate($event: PageChangedEvent): void {
    this.permissionService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$), take(1)).subscribe((qParams: IQuery) => {
      this.router.navigate([PERMISSION_SERVICE.list], {
        queryParams: {...qParams, page: $event.page},
      }).then();
    });
  }
}
