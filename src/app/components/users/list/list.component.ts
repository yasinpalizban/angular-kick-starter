import {Component, OnDestroy, OnInit} from '@angular/core';
import {mergeMap, Subject, takeUntil} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute,  Router} from '@angular/router';
import {BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {IQuery} from '../../../interfaces/iquery';
import {IUser} from '../../../interfaces/iuser';
import {faEdit, faEnvelopeOpen, faTrash} from "@fortawesome/free-solid-svg-icons";
import {BasicList} from "../../../abstracts/basic.list";
import {ModalComponent} from "../../../commons/modal/modal.component";
import {GroupService} from "../../../services/group.service";
import {take} from "rxjs/operators";
import { USER_SERVICE} from "../../../configs/path.constants";
import {Select2OptionData} from "ng-select2";


@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],

})
export class ListComponent extends BasicList implements OnInit, OnDestroy {
  faIcon = {faEdit, faTrash, faEnvelopeOpen};
  user!: IUser[];
  group: Array<Select2OptionData> = [];

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
        return this.userService.retrieve(params);
      })).subscribe((value) => {
      this.user = value.data;
      if (value.pager) {
        this.totalPage = value.pager!.total;
        this.currentPage = value.pager!.currentPage + 1;
        this.sizePage= value.pager!.pageCount!;
      }
    });


    this.groupService.retrieve({limit: 100}).pipe(takeUntil(this.subscription$)).subscribe((data) => {
      data.data.map((item: any) => {
        this.group.push({id: item.id, text: item.name});
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
    const initialState: ModalOptions = {
      initialState: {
        deleteItem: this.user[index].username,
      }
    };
    this.modalRef = this.modalService.show(ModalComponent, initialState);
    this.modalRef.content.onClose = new Subject<boolean>();
    this.modalRef.content.onClose.pipe(takeUntil(this.subscription$)).subscribe((result: boolean) => {
      if (result) {
        this.userService.remove(id);
        this.user?.splice(index, 1);
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
