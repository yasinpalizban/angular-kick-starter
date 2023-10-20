import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs';
import {IQuery} from '../../../interfaces/query.interface';
import {IUser} from '../../../interfaces/user.interface';
import {User} from '../../../models/user.model';
import {IGroup} from "../../../interfaces/group.interface";
import {GroupService} from "../../../services/group.service";
import {faAsterisk, faEnvelope, faPhone, faUser, faUsers, faEye} from "@fortawesome/free-solid-svg-icons";
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {BasicForm} from "../../../abstracts/basic.form";
import {USER_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends BasicForm implements OnInit, OnDestroy {

  faIcon = {
    faPhone,
    faUser, faAsterisk, faEnvelope, faUsers, faEye
  };

  userDetail!: ResponseObject<IUser>;
  groupRows!: ResponseObject<IGroup>;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              protected override router: Router,
              private groupService: GroupService) {
    super(router);
  }

  ngOnInit(): void {


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

    this.groupService.query().pipe(takeUntil(this.subscription$)).subscribe((groups) => {
      this.groupRows = groups;
    });

    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) =>  this.userService.query(+params['id'])
      )).subscribe((user) => {
      this.userDetail = user;
      this.formGroup.controls['lastName'].setValue(user.data.lastName);
      this.formGroup.controls['firstName'].setValue(user.data.firstName);
      this.formGroup.controls['activate'].setValue(user.data.status);
      this.formGroup.controls['groupId'].setValue(user.data!.groupId);
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
    this.userService.update(user);
  }

  override ngOnDestroy(): void {
    this.userService.unsubscribe();
    this.unSubscription();
  }
}
