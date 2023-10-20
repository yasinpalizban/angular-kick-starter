import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import {PermissionUserService} from "../../../services/permission.user.service";
import {PermissionUser} from "../../../models/permission.user.model";
import {IGroup} from "../../../interfaces/group.interface";
import {GroupService} from "../../../services/group.service";
import {takeUntil} from "rxjs";
import {IPermission} from "../../../interfaces/permission.interface";
import {PermissionService} from "../../../services/permission.service";
import {PermissionType} from "../../../enums/permission.enum";
import {UserService} from "../../../services/user.service";
import {IUser} from "../../../interfaces/user.interface";
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {BasicForm} from "../../../abstracts/basic.form";
import {Router} from "@angular/router";


@Component({
  selector: 'app-permission-group-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent extends BasicForm implements OnInit, OnDestroy {
  faIcon = {faAsterisk};

  groupRows!: ResponseObject<IGroup>;
  permissionRows!: ResponseObject<IPermission>;
  usersRows!: ResponseObject<IUser>;
  actionsArray: any;

  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService,
              private permissionService: PermissionService,
              private userService: UserService,
              private userPermissionService: PermissionUserService,
              protected override router: Router) {

    super(router);
    this.actionsArray = [
      {value: "-get", name: PermissionType.Get},
      {value: "-post", name: PermissionType.Post},
      {value: "-put", name: PermissionType.Put},
      {value: "-delete", name: PermissionType.Delete},
    ];
  }

  ngOnInit(): void {


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

    this.groupService.query().pipe(takeUntil(this.subscription$)).subscribe((groups) => {
      this.groupRows = groups;
    });
    this.permissionService.query().pipe(takeUntil(this.subscription$)).subscribe((permission) => {
      this.permissionRows = permission;
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
    this.userService.query(queryParam).pipe(takeUntil(this.subscription$)).subscribe((users) => {
      this.usersRows = users;
    });

  }
}


