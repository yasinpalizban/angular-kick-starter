import {Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {IQuery} from '../../../interfaces/query.interface';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Select2OptionData} from 'ng-select2';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {OperatorType} from '../../../enums/operator.enum';
import {FunctionSearchType} from '../../../enums/function.search.enum';
import {ISearch} from '../../../interfaces/search.interface';
import {HttpParams} from '@angular/common/http';
import {CompressSearchForm} from '../../../utils/compress-search-form';
import {faAsterisk, faEllipsisH, faPlus, faSearch, faTrash} from "@fortawesome/free-solid-svg-icons";
import {PermissionService} from "../../../services/permission.service";

@Component({
  selector: 'app-permission-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit, OnDestroy {
  faIcon = { faTrash ,faAsterisk, faPlus ,faSearch ,faEllipsisH};
  sortData: Array<Select2OptionData>;
  orderData: Array<Select2OptionData>;
  sortValue: string | undefined;
  orderValue: string | undefined;
  formGroup!: FormGroup;
  submitted: boolean;
  subscription: Subscription;
  formAdvanceSearch!: FormGroup;
  modalRef!: BsModalRef;
  operators: Array<string>;
  submitted2: boolean;
  functions: object;


  constructor(private permissionService: PermissionService,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService) {
    this.sortValue = 'id';
    this.orderValue = 'desc';
    this.subscription = new Subscription();
    this.orderData = [{
      id: 'asc',
      text: 'Asc',

    },
      {
        id: 'desc',
        text: 'Desc'
      }];
    this.sortData = [
      {
        id: 'id',
        text: 'Id',

      },
      {
        id: 'name',
        text: 'Name',

      },
      {
        id: 'active',
        text: 'Active',

      }
    ];

    this.operators = Object.values(OperatorType);

    this.functions = FunctionSearchType;
    this.submitted2 = false;
    this.submitted = false;
  }

  ngOnInit(): void {

    this.formGroup = this.formBuilder.group({

      _key: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
    });
    this.formAdvanceSearch = this.formBuilder.group({

      _function: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      _data: this.formBuilder.array([
        this.createFieldSearch()
      ]),

    });
  }

  onSubmit(): void {

    this.subscription = this.permissionService.getQueryArgumentObservable().subscribe((qParams: IQuery) => {

      this.sortValue = qParams.sort;
      this.orderValue = qParams.order;

    });
    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    this.onChangeDataTable();
  }


  onChangeDataTable(): void {

    const search: ISearch = {
      fun: FunctionSearchType.Like,
      sgn: '',
      val: this.formGroup.value._key
    };

    let queryParam = new HttpParams();
    if (this.sortValue != null) {
      queryParam = queryParam.append(this.sortValue, JSON.stringify(search));
    }
    const params: IQuery = {

      sort: this.sortValue,
      order: this.orderValue,
      q: queryParam
    };

    this.permissionService.setQueryArgument(params);

    this.router.navigate(['./admin/permission/list'], {
      queryParams: params,

    });


  }

  onNewItem(): void {
    this.router.navigate(['./admin/permission/add']);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.permissionService.unsubscribe();
  }

  onOpenModal(template: TemplateRef<string>): void {
    const config: ModalOptions = {class: 'modal-lg'};
    this.modalRef = this.modalService.show(template, config);
  }

  onModalHide(): void {
    this.modalRef.hide();

  }


  onSubmitAdvanceSearch(): void {
    this.subscription = this.permissionService.getQueryArgumentObservable().subscribe((qParams) => {


      this.sortValue = qParams.sort;
      this.orderValue = qParams.order;
    });


    if (this.formAdvanceSearch.invalid) {
      return;
    }

    this.submitted2 = true;
    const compressSearchForm = CompressSearchForm(this.formAdvanceSearch);
    let queryParam = new HttpParams();
    for (let i = 0; i < compressSearchForm.value._data.length; i++) {
      const search: ISearch = {
        fun: compressSearchForm.value._function,
        sgn: compressSearchForm.value._data[i]._sign,
        val: compressSearchForm.value._data[i]._value,
      };

      queryParam = queryParam.append(compressSearchForm.value._data[i]._field, JSON.stringify(search));
    }
    this.modalRef.hide();

    const params: IQuery = {
      page: 1,
      sort: this.sortValue,
      order: this.orderValue,
      q: queryParam
    };
    this.permissionService.setQueryArgument(params);
    this.router.navigate(['./admin/permission/list'], {
      queryParams: params,

    });

  }


  onAddField(): void {
    (this.formAdvanceSearch.get('_data') as FormArray).push(
      this.createFieldSearch()
    );
  }

  onRemoveField(index: number): void {
    (this.formAdvanceSearch.get('_data') as FormArray).removeAt(index);
  }

  createFieldSearch(): FormGroup {
    return this.formBuilder.group({
      _sign: this.formBuilder.control('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      _value: this.formBuilder.control('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      _field: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
    });
  }
  get advanceSearchData(): any {

    return this.formAdvanceSearch.get('_data') as FormArray
  }
}
