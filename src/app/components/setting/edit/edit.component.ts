import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SettingService} from '../../../services/setting.service';
import {Setting} from '../../../models/setting.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription, switchMap, takeUntil} from 'rxjs';

import {ISetting} from '../../../interfaces/setting.interface';
import {IQuery} from '../../../interfaces/query.interface';
import {LocationChangeListener} from "@angular/common";
import {faAddressBook, faEye, faFileWord} from "@fortawesome/free-solid-svg-icons";
import {ResponseObject} from "../../../interfaces/response.object.interface";
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
  settingDetail!: ResponseObject<ISetting>;

  constructor(private formBuilder: FormBuilder,
              private settingService: SettingService,
              private activatedRoute: ActivatedRoute,
              protected override router: Router) {
    super(router);
  }

  ngOnInit(): void {


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


    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.settingService.query(+params['id'])
      )).subscribe((setting) => {
      this.settingDetail = setting;
      this.formGroup.controls['_key'].setValue(setting.data.key);
      this.formGroup.controls['_value'].setValue(setting.data.value);
      this.formGroup.controls['description'].setValue(setting.data.description);
      this.formGroup.controls['status'].setValue(+setting.data.status);
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
    this.settingService.update(setting);

  }

  override ngOnDestroy(): void {
    this.settingService.unsubscribe();
    this.unSubscription();
  }


}
