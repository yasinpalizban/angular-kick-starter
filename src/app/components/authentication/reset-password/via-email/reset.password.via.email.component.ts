import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MustMatch} from '../../../../utils/must-match.validator';
import {Auth} from '../../../../models/authenticate.model';
import {AuthenticateService} from '../../../../services/authenticate.service';
import {BasicForm} from "../../../../abstracts/basic.form";
import {Router} from "@angular/router";


@Component({
  selector: 'app-reset-password-via-email',
  templateUrl: './reset.password.via.email.component.html',
  styleUrls: ['./reset.password.via.email.component.scss']
})
export class ResetPasswordViaEmailComponent extends  BasicForm implements OnInit, OnDestroy {


  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticateService
              ,protected  override router: Router
) {
  super(router);
  }

  ngOnInit(): void {
    this. formGroup = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      token: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
      passConfirm: new FormControl('', [
        Validators.required,

      ]),
    }, {
       validators: MustMatch('password', 'passConfirm')
    });

  }

  onSubmit(): void {

    if (this.  formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const auth = new Auth({
      email: this.  formGroup.value.email,
      resetToken: this.  formGroup.value.token,
      password: this.  formGroup.value.password,
      passConfirm: this.  formGroup.value.passConfirm
    });
    this.authService.resetPasswordViaEmail(auth);
    this. formGroup.reset();
  }

  override ngOnDestroy(): void {
    this.authService.unsubscribe();
  }
}
