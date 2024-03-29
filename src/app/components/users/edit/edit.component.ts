import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs';
import {IQuery} from '../../../interfaces/iquery';
import {IUser} from '../../../interfaces/iuser';
import {User} from '../../../models/user.model';
import {IGroup} from "../../../interfaces/igroup";
import {GroupService} from "../../../services/group.service";
import {faAsterisk, faEnvelope, faEye, faPhone, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import {BasicForm} from "../../../abstracts/basic.form";
import {USER_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends BasicForm implements OnInit, OnDestroy {

  faIcon = {faPhone, faUser, faAsterisk, faEnvelope, faUsers, faEye};
  user!: IUser;
  group!: IGroup[];

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              protected override router: Router,
              private groupService: GroupService) {
    super(router);
  }

  private initFrom(): void {
    this.formGroup = this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      activate: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      groupId: new FormControl('', [
        Validators.required,
      ])
    });
  }

  ngOnInit(): void {
    this.initFrom();
    this.initData();
  }

  initData(): void {
    this.groupService.retrieve().pipe(takeUntil(this.subscription$)).subscribe((value) => {
      this.group = value.data;
    });
    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.userService.detail(+params['id'])
      )).subscribe((value) => {
      this.user = value.data;
      this.formGroup.controls['lastName'].setValue(value.data.lastName);
      this.formGroup.controls['firstName'].setValue(value.data.firstName);
      this.formGroup.controls['activate'].setValue(value.data.status);
      this.formGroup.controls['groupId'].setValue(value.data!.groupId);
    });

    this.userService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams: IQuery) => {
      this.params = qParams;
      this.path = USER_SERVICE.base;
    });

  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const user = new User({
      id: this.editId,
      firstName: this.formGroup.value.firstName,
      lastName: this.formGroup.value.lastName,
      status: this.formGroup.value.activate == 1,
      groupId: this.formGroup.value.groupId,
    });
    this.userService.clearAlert();
    this.userService.update(user, this.params);
  }

  override ngOnDestroy(): void {
    this.userService.unsubscribe();
    this.unSubscription();
  }
}
