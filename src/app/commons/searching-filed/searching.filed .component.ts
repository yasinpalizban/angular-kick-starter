import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Select2OptionData} from 'ng-select2';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {OperatorType} from '../../enums/operator.enum';
import {CompressSearchForm} from '../../utils/compress-search-form';
import {faAsterisk, faEllipsisH, faPlus, faSearch, faTrash, faTasks} from "@fortawesome/free-solid-svg-icons";
import {convertSign} from "../../utils/convert.sign";
import {isEmpty} from "../../utils/is.empty";
import {IQuery} from "../../interfaces/iquery.interface";

@Component({
  selector: 'app-searching-filed',
  templateUrl: './searching.filed.component.html',
  styleUrls: ['./searching.filed .component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchingFiledComponent implements OnInit, OnDestroy {
  @Input('redirectPath') redirectPath!: string;
  @Input('listLink') listLink: Array<{ link: string, name: string }> = [];
  @Input('service') service!: any;
  @Input('dataSort') sortData!: Array<Select2OptionData>;
  @Input('ruleSort') ruleData!: Array<Select2OptionData>;
  pageData: Array<Select2OptionData> = [
    {id: '10', text: '10'},
    {id: '20', text: '20'},
    {id: '50', text: '50'},
    {id: '10', text: '100'}
  ];
  faIcon = {faTrash, faAsterisk, faPlus, faSearch, faEllipsisH, faTasks};
  sortValue: string = 'id';
  orderValue: string = 'desc';
  pageValue: number = 10;
  ruleValue: string = '';
  formGroup!: FormGroup;
  submitted: boolean = false;
  subscription: Subscription = new Subscription();
  formAdvanceSearch!: FormGroup;
  modalRef!: BsModalRef;
  operators: Array<string> = Object.values(OperatorType);
  submitted2: boolean = false;
  orderData: Array<Select2OptionData> = [{id: 'asc', text: 'Asc',}, {id: 'desc', text: 'Desc'}];

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService) {

  }

  ngOnInit(): void {

    this.formGroup = this.formBuilder.group({

      _key: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
    });
    this.formAdvanceSearch = this.formBuilder.group({
      _data: this.formBuilder.array([
        this.createFieldSearch()
      ]),

    });

  }

  onSubmit(): void {

    if (this.formGroup.invalid) {
      return;
    }

    this.subscription = this.service.getQueryArgumentObservable().subscribe((qParams: IQuery) => {
      if (!isEmpty(qParams)) {
        this.sortValue = qParams.sort!;
        this.orderValue = qParams.order!;
      }
    });

    this.submitted = true;
    this.onChangeDataTable();
  }


  onChangePaginate(): void {
    let queryParam = 'sort=' + this.sortValue! + '&order=' + this.orderValue!+ '&limit='+this.pageValue;
      if (this.ruleData?.length! > 0) {
        queryParam += '&foreignKey=' + this.ruleValue!;
      }
      this.router.navigateByUrl('admin/' + this.redirectPath + '/list?' + queryParam).then();
  }

  onChangeDataTable(): void {
    let queryParam = ''
    if (this.formGroup.value._key.length > 0) {
      queryParam = this.sortValue + '[lik]=' + this.formGroup.value._key;
      this.router.navigateByUrl('admin/' + this.redirectPath + '/list?' + queryParam).then();
    } else {
      queryParam = 'sort=' + this.sortValue! + '&order=' + this.orderValue!;
      if (this.ruleData?.length! > 0) {
        queryParam += '&foreignKey=' + this.ruleValue!;
      }
      this.router.navigateByUrl('admin/' + this.redirectPath + '/list?' + queryParam).then();
    }
  }

  onNewItem(): void {
    this.router.navigate(['./admin/' + this.redirectPath + '/add']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.service?.unsubscribe();
  }

  onOpenModal(template: TemplateRef<string>): void {
    const config: ModalOptions = {class: 'modal-lg'};
    this.modalRef = this.modalService.show(template, config);
  }

  onModalHide(): void {
    this.modalRef.hide();
  }

  async onSubmitAdvanceSearch(): Promise<void> {
    this.subscription = this.service.getQueryArgumentObservable().subscribe((qParams: IQuery) => {

      if (qParams) {
        this.sortValue = qParams.sort!;
        this.orderValue = qParams.order!;
      }
    });
    if (this.formAdvanceSearch.invalid) {
      return;
    }
    this.submitted2 = true;

    const compressSearchForm = CompressSearchForm(this.formAdvanceSearch);
    let queryParam = `page=1&sort=${this.sortValue!}&order=${this.orderValue!}`;

    for (let i = 0; i < compressSearchForm.value._data.length; i++) {
      let sign = convertSign(compressSearchForm.value._data[i]._sign);
      queryParam += `&${compressSearchForm.value._data[i]._field}[${sign}]=${compressSearchForm.value._data[i]._value}`
    }
    this.modalRef.hide();
    await this.router.navigateByUrl('admin/' + this.redirectPath + '/list?' + queryParam);
  }


  onAddField(): void {
    (this.formAdvanceSearch.get('_data') as FormArray).push(
      this.createFieldSearch()
    );
  }

  onRemoveField(index: number): void {
    (this.formAdvanceSearch.get('_data') as FormArray).removeAt(index);
  }

  createFieldSearch():
    FormGroup {
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

  getPermission(): string {
    if (this.redirectPath.indexOf('-') != -1) {
      return this.redirectPath.replace('-', '');
    }
    return this.redirectPath;
  }
}
