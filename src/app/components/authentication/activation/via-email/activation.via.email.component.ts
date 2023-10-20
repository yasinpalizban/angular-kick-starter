import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl,  Validators} from '@angular/forms';
import {Auth} from '../../../../models/authenticate.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthenticateService} from '../../../../services/authenticate.service';
import {BasicForm} from "../../../../abstracts/basic.form";

@Component({
  selector: 'app-activation-via-email',
  templateUrl: './activation.via.email.component.html',
  styleUrls: ['./activation.via.email.component.scss']
})
export class ActivationViaEmailComponent extends BasicForm implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticateService,
              private activatedRoute: ActivatedRoute
              ,protected  override router: Router
  ) {
    super(router);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (!params) {

        this.authService.activateAccountViaEmail(params['token']);
      }
    });

    this.formGroup = this.formBuilder.group({
      token: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)

      ]),
    });

  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;

    const auth = new Auth({
      activeToken: this.formGroup.value.token.replace(/\s/g, ""),
      email: this.formGroup.value.email.replace(/\s/g, "")
    });
    this.authService.activateAccountViaEmail(auth);
  }

  override ngOnDestroy(): void {
    this.authService.unsubscribe();
  }

  onSendEmail(): void {

    if (this.formGroup.controls['email'].invalid) {
      return;
    }
    const auth = new Auth({
      email: this.formGroup.value.email
    });

    this.authService.sendActivateCodeViaEmail(auth);
  }
}
