import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl,  Validators} from '@angular/forms';
import {Auth} from '../../../../models/authenticate.model';
import {AuthenticateService} from '../../../../services/authenticate.service';
import {BasicForm} from "../../../../abstracts/basic.form";
import {Router} from "@angular/router";

@Component({
  selector: 'app-activation-via-sms',
  templateUrl: './activation.via.sms.component.html',
  styleUrls: ['./activation.via.sms.component.scss']
})
export class ActivationViaSmsComponent extends BasicForm implements OnInit, OnDestroy {



  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticateService,
              protected  override router: Router
  ) {
    super(router);
  }

  ngOnInit(): void {

    this.formGroup = this.formBuilder.group({
      code: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      phone: new FormControl('', [
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
      activeToken: this.formGroup.value.code.toString().replace(/\s/g, ""),
      phone: this.formGroup.value.phone.replace(/\s/g, "")
    });
    this.authService.activateAccountViaSms(auth);
  }

  override ngOnDestroy(): void {
    this.authService.unsubscribe();
  }

  onSendSms(): void {
    if (this.formGroup.controls['phone'].invalid) {
      return;
    }
    const auth = new Auth({
      phone: this.formGroup.value.phone,
    });

    this.authService.sendActivateCodeViaSms(auth);
  }


}
