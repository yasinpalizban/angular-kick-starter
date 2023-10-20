import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Auth} from '../../../models/authenticate.model';
import {OnExecuteData, OnExecuteErrorData, RecaptchaErrorParameters, ReCaptchaV3Service} from 'ng-recaptcha';
import { takeUntil} from 'rxjs';
import {AuthenticateService} from '../../../services/authenticate.service';
import {BasicForm} from "../../../abstracts/basic.form";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent extends BasicForm implements OnInit, OnDestroy {


  private token: string;
  private action: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticateService,
              private recaptchaV3Service: ReCaptchaV3Service
              ,protected  override router: Router
  ) {
    super(router);
    this.token = ''
    this.action = 'importantAction';
  }


  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      login: new FormControl('', [
        Validators.required,
      ])
    });
    this.recaptchaV3Service.execute(this.action).pipe(takeUntil(this.subscription$))
      .subscribe((token) => {
        this.token = token;
      });
  }


  onSubmit(): void {

    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const auth = new Auth({
      login: this.formGroup.value.login,
      token: this.token,
      action: this.action
    });
    this.authService.forgot(auth);
    this.formGroup.reset();
  }

  override ngOnDestroy(): void {
    this.authService.unsubscribe();

  }

}
