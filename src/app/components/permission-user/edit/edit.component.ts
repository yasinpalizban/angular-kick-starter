import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs';
import {IQuery} from '../../../interfaces/iquery';
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import {IPermissionUser} from "../../../interfaces/ipermission.user";
import {PermissionUserService} from "../../../services/permission.user.service";
import {PermissionUser} from "../../../models/permission.user.model";
import {IGroup} from "../../../interfaces/igroup";
import {IPermission} from "../../../interfaces/ipermission";
import {GroupService} from "../../../services/group.service";
import {PermissionService} from "../../../services/permission.service";
import {PermissionType} from "../../../enums/permission.enum";
import {IUser} from "../../../interfaces/iuser";
import {UserService} from "../../../services/user.service";
import {IResponseObject} from "../../../interfaces/iresponse.object";
import {BasicForm} from "../../../abstracts/basic.form";
import {USER_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-permission-group-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends BasicForm implements OnInit, OnDestroy {
  faIcon = {faAsterisk};

  permissionUser!: IPermissionUser;
  group!: IGroup[];
  permission!: IPermission[];
  users!: IUser[];
  isGet: boolean = false;
  isPut: boolean = false;
  isPost: boolean = false;
  isDelete: boolean = false;
  isCheck: boolean = false;


  constructor(private formBuilder: FormBuilder,
              private userPermissionService: PermissionUserService,
              private activatedRoute: ActivatedRoute,
              protected override router: Router,
              private groupService: GroupService,
              private userService: UserService,
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
      userId: new FormControl('', [
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
    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.userPermissionService.detail(+params['id'])
      )).subscribe((value) => {
      this.permissionUser = value.data;
      this.formGroup.controls['userId'].setValue(value.data.userId);
      this.formGroup.controls['permissionId'].setValue(value.data.permissionId);
    });


    this.groupService.retrieve({limit: 100}).pipe(takeUntil(this.subscription$)).subscribe((value) => {
      this.group =value.data;
    });

    this.permissionService.retrieve({limit: 200}).pipe(takeUntil(this.subscription$)).subscribe((value) => {
      this.permission = value.data;
    });

    this.permissionUser.actions.split("-").forEach((value: string) => {

      if (value === "get")
        this.isGet = true;
      else if (value === "post")
        this.isPost = true;

      else if (value === "put")
        this.isPut = true;

      else if (value === "delete")
        this.isDelete = true;

    });
    this.userPermissionService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams: IQuery) => {
      this.params = qParams;
      this.path = USER_SERVICE.base;
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
    const userPermission = new PermissionUser({
      id: this.editId,
      userId: this.formGroup.value.userId,
      permissionId: this.formGroup.value.permissionId,
      actions: combineAction,
    });
    this.userPermissionService.clearAlert();
    this.userPermissionService.update(userPermission, this.params);
  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.userPermissionService.unsubscribe();
  }

  onCheckboxChange(e: any) {
    const actions: FormArray = this.formGroup.get('actions') as FormArray;
    if (!this.isCheck) {
      this.isCheck = true;
      const actBox = this.permissionUser.actions.split("-");
      actBox.forEach((value: string) => {
        if (value)
          actions.push(new FormControl("-" + value))
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


  onChangeGroup(value: any): void {
    const params = `foreignKey=${value.target.value}`;
    this.userService.retrieve(params).pipe(takeUntil(this.subscription$)).subscribe((value) => {
      this.users = value.data;
    });
  }
}
