import {Component, OnDestroy, OnInit} from '@angular/core';
import {mergeMap, Subject, takeUntil} from 'rxjs';
import {GroupService} from '../../../services/group.service';
import {ActivatedRoute, Router} from '@angular/router';
import { BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {IQuery} from '../../../interfaces/iquery.interface';
import {IGroup} from '../../../interfaces/igroup.interface';
import {faEdit, faTrash, faEnvelopeOpen} from '@fortawesome/free-solid-svg-icons';
import {IResponseObject} from "../../../interfaces/iresponse.object.interface";
import {BasicList} from "../../../abstracts/basic.list";
import {ModalComponent} from "../../../commons/modal/modal.component";
import {GROUP_SERVICE} from "../../../configs/path.constants";
import {take} from "rxjs/operators";


@Component({
  selector: 'app-group-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],

})
export class ListComponent extends BasicList implements OnInit, OnDestroy {
  faIcon = {faEdit, faTrash, faEnvelopeOpen};
  group!: IResponseObject<IGroup>;

  constructor(public groupService: GroupService,
              private router: Router,
              private modalService: BsModalService,
              protected override activatedRoute: ActivatedRoute
  ) {
    super( activatedRoute);
  }

  ngOnInit(): void {
    this.sortData = [{id: 'id', text: 'Id',}, {id: 'name', text: 'Name'}];
    this.activatedRoute.queryParams.pipe(takeUntil(this.subscription$),
      mergeMap((params) => {
        this.groupService.setQueryArgument(params);
        return this.groupService.query(params);
      })).subscribe((data) => {
      this.group = data;
      if (data.pager) {
        this.totalPage = data.pager!.total;
        this.currentPage = data.pager!.currentPage+1;
      }
    });
  }

  override ngOnDestroy(): void {
    this.groupService.unsubscribe();
    this.unSubscription();
  }

 async onEditItem(id: number): Promise<void> {
    await this.router.navigate([GROUP_SERVICE.edit + id]);
  }

 async onDetailItem(id: number): Promise<void> {
  await  this.router.navigate([GROUP_SERVICE.detail + id]);
  }

  onOpenModal(id: number, index: number): void {

    this.deleteId = id;
    this.deleteIndex = index;
    this.deleteItem = this.group.data![index].name;
    const initialState: ModalOptions = {
      initialState: {
        deleteItem: this.deleteItem,
      }
    };
    this.modalRef = this.modalService.show(ModalComponent, initialState);
    this.modalRef.content.onClose = new Subject<boolean>();
    this.modalRef.content.onClose.pipe(takeUntil(this.subscription$)).subscribe((result: boolean) => {
      if (result) {
        this.groupService.remove(this.deleteId);
        this.group.data!.splice(this.deleteIndex, 1);
      }
    });
  }


  onChangePaginate($event: PageChangedEvent): void {
    this.groupService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$), take(1)).subscribe((qParams: IQuery) => {
      this.router.navigate([GROUP_SERVICE.list], {
        queryParams: {...qParams, page: $event.page},
      }).then();
    });
  }
}
