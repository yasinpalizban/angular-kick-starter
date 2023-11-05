import {Component, OnDestroy, OnInit } from '@angular/core';
import {mergeMap, Subject, takeUntil} from 'rxjs';
import {SettingService} from '../../../services/setting.service';
import {ISetting} from '../../../interfaces/isetting.interface';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {IQuery} from '../../../interfaces/iquery.interface';
import {faEdit, faEnvelopeOpen, faTrash} from "@fortawesome/free-solid-svg-icons";
import {IResponseObject} from "../../../interfaces/iresponse.object.interface";
import {BasicList} from "../../../abstracts/basic.list";
import {ModalComponent} from "../../../commons/modal/modal.component";
import {SETTING_SERVICE} from "../../../configs/path.constants";
import {take} from "rxjs/operators";


@Component({
  selector: 'app-setting-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],


})
export class ListComponent extends BasicList implements OnInit, OnDestroy {
  faIcon = {faEdit, faTrash, faEnvelopeOpen};
  setting!: IResponseObject<ISetting>;

  constructor(public settingService: SettingService,
              private router: Router,
              protected override activatedRoute: ActivatedRoute,
              private modalService: BsModalService,
  ) {
    super(activatedRoute)

  }

  ngOnInit(): void {
    this.sortData = [
      {id: 'id', text: 'Id'},
      {id: 'key', text: 'Key '},
      {id: 'value', text: 'Value'},
      {id: 'status', text: 'Status'}
    ];

    this.activatedRoute.queryParams.pipe(takeUntil(this.subscription$),
      mergeMap((params) => {
        this.settingService.setQueryArgument(params);
        return this.settingService.query(params);
      })).subscribe((data) => {
      this.setting = data;
      if (data.pager) {
        this.totalPage = data.pager!.total;
        this.currentPage = data.pager!.currentPage+1;
      }
    });

  }

  override ngOnDestroy(): void {
    this.settingService.unsubscribe();
    this.unSubscription();
  }


  async  onEditItem(id: number): Promise<void> {

   await  this.router.navigate([SETTING_SERVICE.edit + id]);
  }

 async onDetailItem(id: number): Promise<void> {

   await this.router.navigate([SETTING_SERVICE.detail + id]);
  }

  onOpenModal(id: number, index: number): void {

    this.deleteId = id;
    this.deleteIndex = index;
    this.deleteItem = this.setting.data![index].key;

    const initialState: ModalOptions = {
      initialState: {
        deleteItem: this.deleteItem,
      }
    };

    this.modalRef = this.modalService.show(ModalComponent, initialState);
    this.modalRef.content.onClose = new Subject<boolean>();
    this.modalRef.content.onClose.pipe(takeUntil(this.subscription$)).subscribe((result: boolean) => {
      if (result) {
        this.settingService.remove(this.deleteId);
        this.setting.data!.splice(this.deleteIndex, 1);
      }
    });

  }


  onChangePaginate($event: PageChangedEvent): void {
    this.settingService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$), take(1)).subscribe((qParams: IQuery) => {
      this.router.navigate([SETTING_SERVICE.list], {
        queryParams: {...qParams, page: $event.page},
      }).then();
    });
  }
}
