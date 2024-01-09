import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {User} from '../../../models/user.model';
import {GroupService} from "../../../services/group.service";
import {IGroup} from "../../../interfaces/igroup";
import {faPhone, faUser, faAsterisk, faEnvelope, faUsers} from '@fortawesome/free-solid-svg-icons';
import {BasicForm} from "../../../abstracts/basic.form";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent extends BasicForm implements OnInit, OnDestroy {
  faIcon = {faPhone, faUser, faAsterisk, faEnvelope, faUsers};
  defaultPassword: string = 'abc123456';
  group!: IGroup[];

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private groupService: GroupService,
              protected override router: Router,) {
    super(router);
  }

  ngOnInit(): void {
    this.initFrom();
    this.initData();
  }

  private initData(): void {
    this.groupService.retrieve().pipe(takeUntil(this.subscription$)).subscribe((value) => {
      this.group = value.data;
    });
  }

  private initFrom(): void {
    this.formGroup = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255)
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]), phone: new FormControl('', [
        Validators.required,
        Validators.maxLength(11)
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      groupId: new FormControl('', [
        Validators.required,
      ])
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const user = new User({
      email: this.formGroup.value.email,
      phone: this.formGroup.value.phone,
      firstName: this.formGroup.value.firstName,
      lastName: this.formGroup.value.lastName,
      username: this.formGroup.value.username,
      groupId: this.formGroup.value.groupId,
      password: this.defaultPassword,
    });
    this.userService.clearAlert();
    this.userService.save(user);
  }

  override ngOnDestroy(): void {
    this.groupService.unsubscribe();
    this.userService.unsubscribe();
  }
}
