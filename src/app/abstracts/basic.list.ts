import {BsModalRef} from 'ngx-bootstrap/modal';
import {MainAbstract} from "./main.abstract";
import {Select2OptionData} from "ng-select2";
import {Component, HostListener} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({ template: '' })
export class BasicList extends MainAbstract {

 protected totalPage: number = 1;
 protected currentPage: number = 1;
 protected sizePage: number = 10;
 protected modalRef!: BsModalRef;
 protected deleteId: number = 0;
 protected deleteIndex: number = 0;
 protected deleteItem: string = '';
protected  sortData: Array<Select2OptionData> = [];
  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.currentPage !== (+this. activatedRoute.snapshot.queryParams['page'])) {
      this.currentPage = this. activatedRoute.snapshot.queryParams['page'] ? +this. activatedRoute.snapshot.queryParams['page'] : 1;
    }
  }
  constructor(protected activatedRoute: ActivatedRoute,) {
    super();

  }
}
