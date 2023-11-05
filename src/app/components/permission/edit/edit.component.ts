import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs';
import {IQuery} from '../../../interfaces/iquery.interface';
import {faFileWord, faStickyNote, faEye} from "@fortawesome/free-solid-svg-icons";
import {IPermission} from "../../../interfaces/ipermission.interface";
import {PermissionService} from "../../../services/permission.service";
import {Permission} from "../../../models/permission.model";
import {IResponseObject} from "../../../interfaces/iresponse.object.interface";
import {BasicForm} from "../../../abstracts/basic.form";
import {PERMISSION_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-permission-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends BasicForm implements OnInit, OnDestroy {
  faIcon = {faStickyNote, faFileWord, faEye};
  permission!: IResponseObject<IPermission>;

  constructor(private formBuilder: FormBuilder,
              private permissionService: PermissionService,
              private activatedRoute: ActivatedRoute,
              protected override router: Router) {
    super(router);
  }

  private initForm(): void {

    this.formGroup = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      active: new FormControl('', [
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
      switchMap((params) => this.permissionService.query(+params['id'])
      )).subscribe((data) => {
      this.permission = data;
      this.formGroup.controls['name'].setValue(data.data.name);
      this.formGroup.controls['description'].setValue(data.data.description);
      this.formGroup.controls['active'].setValue(data.data.active);
    });

    this.permissionService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams: IQuery) => {
      this.params = qParams;
      this.path = PERMISSION_SERVICE.base;
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const permission = new Permission({
      id: this.editId,
      name: this.formGroup.value.name.toLowerCase(),
      description: this.formGroup.value.description,
      active: this.formGroup.value.active == 1,
    });
    this.permissionService.clearAlert();
    this.permissionService.update(permission, this.params);
  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.permissionService.unsubscribe();
  }


}
