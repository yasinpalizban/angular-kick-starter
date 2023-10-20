import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs';
import {IQuery} from '../../../interfaces/query.interface';
import {LocationChangeListener} from "@angular/common";
import {faFileWord, faStickyNote, faEye} from "@fortawesome/free-solid-svg-icons";
import {IPermission} from "../../../interfaces/permission.interface";
import {PermissionService} from "../../../services/permission.service";
import {Permission} from "../../../models/permission.model";
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {BasicForm} from "../../../abstracts/basic.form";
import {PERMISSION_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-permission-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends BasicForm implements OnInit, OnDestroy {
  faIcon = {faStickyNote, faFileWord, faEye};
  permissionDetail!: ResponseObject<IPermission>;


  constructor(private formBuilder: FormBuilder,
              private permissionService: PermissionService,
              private activatedRoute: ActivatedRoute,
              protected override router: Router) {
    super(router);
  }

  ngOnInit(): void {


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

    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.permissionService.query(+params['id'])
      )).subscribe((permission) => {
      this.permissionDetail = permission;
      this.formGroup.controls['name'].setValue(permission.data.name);
      this.formGroup.controls['description'].setValue(permission.data.description);
      this.formGroup.controls['active'].setValue(permission.data.active);
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
    this.permissionService.update(permission);

  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.permissionService.unsubscribe();
  }


}
