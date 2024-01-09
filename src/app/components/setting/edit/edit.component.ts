import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl,  Validators} from '@angular/forms';
import {SettingService} from '../../../services/setting.service';
import {Setting} from '../../../models/setting.model';
import {ActivatedRoute,  Router} from '@angular/router';
import { switchMap, takeUntil} from 'rxjs';
import {ISetting} from '../../../interfaces/isetting';
import {faAddressBook, faEye, faFileWord} from "@fortawesome/free-solid-svg-icons";
import {BasicForm} from "../../../abstracts/basic.form";
import {SETTING_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-setting-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends BasicForm implements OnInit, OnDestroy {

  faIcon = {
    faEye, faFileWord, faAddressBook
  };
  setting!: ISetting;

  constructor(private formBuilder: FormBuilder,
              private settingService: SettingService,
              private activatedRoute: ActivatedRoute,
              protected override router: Router) {
    super(router);
  }

  private initForm(): void {


    this.formGroup = this.formBuilder.group({

      _key: new FormControl('', []),
      _value: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      status: new FormControl('', [
        Validators.required,
      ]),
    });

  }

  ngOnInit(): void {

    this.initForm();
    this.initData();

  }

  private initData(): void {
    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.settingService.detail(+params['id'])
      )).subscribe((value) => {
      this.setting = value.data;
      this.formGroup.controls['_key'].setValue(value.data.key);
      this.formGroup.controls['_value'].setValue(value.data.value);
      this.formGroup.controls['description'].setValue(value.data.description);
      this.formGroup.controls['status'].setValue(+value.data.status);
    });

    this.settingService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams) => {
      this.params = qParams;
      this.path = SETTING_SERVICE.base;
    });
  }

  onSubmit(): void {


    if (this.formGroup.invalid) {
      return;
    }

    this.submitted = true;

    const setting = new Setting({
      id: this.editId,
      value: this.formGroup.value._value.toUpperCase(),
      description: this.formGroup.value.description,
      status: this.formGroup.value.status == 1,
    });
    this.settingService.clearAlert();
    this.settingService.update(setting, this.params);

  }

  override ngOnDestroy(): void {
    this.settingService.unsubscribe();
    this.unSubscription();
  }


}
