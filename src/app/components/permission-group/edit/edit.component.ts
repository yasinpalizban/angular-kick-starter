import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs';
import {IQuery} from '../../../interfaces/iquery';
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import {IPermissionGroup} from "../../../interfaces/ipermission.group";
import {PermissionGroupService} from "../../../services/permission.group.service";
import {PermissionGroup} from "../../../models/permission.group.model";
import {IGroup} from "../../../interfaces/igroup";
import {IPermission} from "../../../interfaces/ipermission";
import {GroupService} from "../../../services/group.service";
import {PermissionService} from "../../../services/permission.service";
import {BasicForm} from "../../../abstracts/basic.form";
import {PERMISSION_GROUP_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-permission-group-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends BasicForm implements OnInit, OnDestroy {
  faIcon = {faAsterisk};

  permissionGroup!: IPermissionGroup;
  group!: IGroup[];
  permission!: IPermission[];
  isGet: boolean = false;
  isPut: boolean = false;
  isPost: boolean = false;
  isDelete: boolean = false;
  isCheck: boolean = false;


  constructor(private formBuilder: FormBuilder,
              private permissionGroupService: PermissionGroupService,
              private activatedRoute: ActivatedRoute,
              protected override router: Router,
              private groupService: GroupService,
              private permissionService: PermissionService,
  ) {
    super(router);
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      permissionId: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      groupId: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      actions: this.formBuilder.array([], [])
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  private initData(): void {
    this.groupService.retrieve().pipe(takeUntil(this.subscription$)).subscribe((value) => {
      this.group = value.data;
    });
    this.permissionService.retrieve().pipe(takeUntil(this.subscription$)).subscribe((value) => {
      this.permission = value.data;
    });
    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.permissionGroupService.detail(+params['id'])
      )).subscribe((value) => {
      this.permissionGroup = value.data;
      this.formGroup.controls['groupId'].setValue(value.data.groupId);
      this.formGroup.controls['permissionId'].setValue(value.data.permissionId);
    });

    this.permissionGroup.actions.split("-").forEach((value: string) => {
      if (value === "get")
        this.isGet = true;
      else if (value === "post")
        this.isPost = true;
      else if (value === "put")
        this.isPut = true;
      else if (value === "delete")
        this.isDelete = true;
    });

    this.permissionGroupService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams: IQuery) => {
      this.params = qParams;
      this.path = PERMISSION_GROUP_SERVICE.base;
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const actions: FormArray = this.formGroup.get('actions') as FormArray;
    let combineAction = '';
    actions.controls.forEach(ctl => combineAction += ctl.value);
    const permissionGroup = new PermissionGroup({
      id: this.editId,
      groupId: this.formGroup.value.groupId,
      permissionId: this.formGroup.value.permissionId,
      actions: combineAction,
    });
    this.permissionGroupService.clearAlert();
    this.permissionGroupService.update(permissionGroup, this.params);
  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.permissionGroupService.unsubscribe();
  }

  onCheckboxChange(e: any) {
    const actions: FormArray = this.formGroup.get('actions') as FormArray;
    if (!this.isCheck) {
      this.isCheck = true;
      const actBox = this.permissionGroup.actions.split("-");
      actBox.forEach((value: string) => {
        if (value)
          actions.push(new FormControl("-" + value));
      });
    }
    if (e.target.checked) {
      const index = actions.controls.findIndex(x => x.value === e.target.value);
      if (index == -1)
        actions.push(new FormControl(e.target.value));
    } else {
      const index = actions.controls.findIndex(x => x.value === e.target.value);
      actions.removeAt(index);
    }
  }
}
