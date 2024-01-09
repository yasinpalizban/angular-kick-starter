import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import {PermissionUserService} from "../../../services/permission.user.service";
import {PermissionUser} from "../../../models/permission.user.model";
import {IGroup} from "../../../interfaces/igroup";
import {GroupService} from "../../../services/group.service";
import {takeUntil} from "rxjs";
import {IPermission} from "../../../interfaces/ipermission";
import {PermissionService} from "../../../services/permission.service";
import {UserService} from "../../../services/user.service";
import {IUser} from "../../../interfaces/iuser";
import {IResponseObject} from "../../../interfaces/iresponse.object";
import {BasicForm} from "../../../abstracts/basic.form";
import {Router} from "@angular/router";


@Component({
  selector: 'app-permission-group-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent extends BasicForm implements OnInit, OnDestroy {
  faIcon = {faAsterisk};

  group!: IGroup[];
  permission!: IPermission[];
  users!: IUser[];
  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService,
              private permissionService: PermissionService,
              private userService: UserService,
              private userPermissionService: PermissionUserService,
              protected override router: Router) {

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
      actions: this.formBuilder.array([], [Validators.required])
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
      permissionId: this.formGroup.value.permissionId,
      userId: this.formGroup.value.userId,
      actions: combineAction
    });
    this.userPermissionService.clearAlert();
    this.userPermissionService.save(userPermission);

  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.userPermissionService.unsubscribe();
  }

  onCheckboxChange(e: any) {

    const actions: FormArray = this.formGroup.get('actions') as FormArray;
    if (e.target.checked) {
      actions.push(new FormControl(e.target.value));
    } else {
      const index = actions.controls.findIndex(x => x.value === e.target.value);
      actions.removeAt(index);
    }


  }

  onChangeGroup(value: any): void {
    const queryParam = `foreignKey=${value.target.value}`;
    this.userService.retrieve(queryParam).pipe(takeUntil(this.subscription$)).subscribe((value) => {
      this.users = value.data;
    });

  }
}


