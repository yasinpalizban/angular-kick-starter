import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import {PermissionGroupService} from "../../../services/permission.group.service";
import {PermissionGroup} from "../../../models/permission.group.model";
import {IGroup} from "../../../interfaces/igroup";
import {GroupService} from "../../../services/group.service";
import {takeUntil} from "rxjs";
import {IPermission} from "../../../interfaces/ipermission";
import {PermissionService} from "../../../services/permission.service";
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


  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService,
              private permissionService: PermissionService,
              private permissionGroupService: PermissionGroupService,
              protected override router: Router
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
    })

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
    const permission = new PermissionGroup({
      permissionId: this.formGroup.value.permissionId,
      groupId: this.formGroup.value.groupId,
      actions: combineAction
    });
    this.permissionGroupService.clearAlert();
    this.permissionGroupService.save(permission);
  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.permissionGroupService.unsubscribe();
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
}


