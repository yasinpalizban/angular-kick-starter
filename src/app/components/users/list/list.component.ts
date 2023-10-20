import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {mergeMap, Subject, takeUntil} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {IQuery} from '../../../interfaces/query.interface';
import {IUser} from '../../../interfaces/user.interface';
import {faEdit, faEnvelopeOpen, faTrash} from "@fortawesome/free-solid-svg-icons";
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {BasicList} from "../../../abstracts/basic.list";
import {ModalComponent} from "../../../helpers/modal/modal.component";
import {GroupService} from "../../../services/group.service";
import {take} from "rxjs/operators";
import {SETTING_SERVICE, USER_SERVICE} from "../../../configs/path.constants";


@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],

})
export class ListComponent extends BasicList implements OnInit, OnDestroy {
  faIcon = {faEdit, faTrash, faEnvelopeOpen};
  userRows!: ResponseObject<IUser>;
  groupRows: any[] = [];

  constructor(public userService: UserService,
              private router: Router,
              protected override activatedRoute: ActivatedRoute,
              private modalService: BsModalService,
              private groupService: GroupService
  ) {
    super(activatedRoute);

  }

  ngOnInit(): void {

    this.sortData = [
      {id: 'id', text: 'Id',},
      {id: 'email', text: 'Email',},
      {id: 'username', text: 'Username',},
      {id: 'activate', text: 'Activate',}
    ];

    this.activatedRoute.queryParams.pipe(takeUntil(this.subscription$),
      mergeMap((params) => {
        this.userService.setQueryArgument(params);
        return this.userService.query(params);
      })).subscribe((users) => {
      this.userRows = users;
      if (users.pager) {
        this.totalPage = users.pager!.total;
        this.currentPage = users.pager!.currentPage + 1;
      }
    });


    this.groupService.query({limit: 100}).pipe(takeUntil(this.subscription$)).subscribe((groups) => {
      groups.data.map((item: any) => {
        this.groupRows.push({id: item.id, text: item.name});
      })
    });


  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.userService.unsubscribe();
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
    this.deleteItem = this.userRows.data![index].username;
    const initialState: ModalOptions = {
      initialState: {
        deleteItem: this.deleteItem,
      }
    };
    this.modalRef = this.modalService.show(ModalComponent, initialState);
    this.modalRef.content.onClose = new Subject<boolean>();
    this.modalRef.content.onClose.pipe(takeUntil(this.subscription$)).subscribe((result: boolean) => {
      if (result) {
        this.userService.remove(this.deleteId);
        this.userRows.data?.splice(this.deleteIndex, 1);
      }
    });

  }


  onChangePaginate($event: PageChangedEvent): void {
    this.userService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$), take(1)).subscribe((qParams: IQuery) => {
      this.router.navigate([USER_SERVICE.list], {
        queryParams: {...qParams, page: $event.page},
      }).then();
    });
  }


}
