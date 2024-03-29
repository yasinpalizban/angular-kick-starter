import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ProfileService} from '../../../services/profile.service';
import {MustMatch} from '../../../utils/must-match.validator';
import {Profile} from '../../../models/profile.model';
import {faAsterisk} from '@fortawesome/free-solid-svg-icons';
import {BasicForm} from "../../../abstracts/basic.form";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss']
})
export class UserPasswordComponent extends BasicForm implements OnInit, OnDestroy {
  faIcon = {faAsterisk};


  constructor(private formBuilder: FormBuilder,
              private profileService: ProfileService,
              protected override router: Router) {
    super(router);
  }

  ngOnInit(): void {


    this.formGroup = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      passConfirm: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)


      ]),
    }, {
      validators: MustMatch('password', 'passConfirm')
    });


  }

  onSubmit(): void {


    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const profile = new Profile({
      password: this.formGroup.value.password,
      passConfirm: this.formGroup.value.passConfirm
    });
    this.profileService.save(profile);
  }

  override ngOnDestroy(): void {

    this.profileService.unsubscribe();
  }

}
