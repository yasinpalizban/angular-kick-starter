import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs';
import {IProfile} from '../../../interfaces/iprofile';
import {ProfileService} from '../../../services/profile.service';
import {Profile} from '../../../models/profile.model';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

import {environment} from '../../../../environments/environment';
import {
  faEnvelope,
  faPhone,
  faUser,
  faVenusMars,
  faStickyNote
} from "@fortawesome/free-solid-svg-icons";
import {BasicForm} from "../../../abstracts/basic.form";
import {Router} from "@angular/router";


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent extends BasicForm implements OnInit, OnDestroy {
  faIcon = {faPhone, faUser, faEnvelope, faVenusMars, faStickyNote};
  profile!: IProfile;
  image: SafeUrl | string = 'assets/images/icon/default-avatar.jpg';
  isNewImage: boolean = false;
  formData = new FormData();


  constructor(private formBuilder: FormBuilder,
              private profileService: ProfileService,
              private sanitizer: DomSanitizer,
              protected override router: Router) {
    super(router);
  }

  public getSantizeUrl(url: SafeUrl | string): SafeUrl | string {

    if (url.toString().indexOf('assets') !== -1 || this.isNewImage) {
      return this.image;
    } else {
      return this.sanitizer.bypassSecurityTrustUrl(environment.siteUrl + url);
    }
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255)
      ]), username: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      gender: new FormControl('', [
        Validators.required,
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      bio: new FormControl('', [
        Validators.required,
        Validators.maxLength(499),
      ]),
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      image: [null],
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  private initData(): void {
    this.profileService.retrieve().pipe(takeUntil(this.subscription$)).subscribe((value) => {
      this.profile = value.data;
      this.formGroup.controls['firstName'].setValue(value.data!.firstName);
      this.formGroup.controls['lastName'].setValue(value.data!.lastName);
      this.formGroup.controls['gender'].setValue(value.data!.gender);
      this.formGroup.controls['phone'].setValue(value.data!.phone);
      this.formGroup.controls['title'].setValue(value.data!.title);
      this.formGroup.controls['bio'].setValue(value.data!.bio);
      this.formGroup.controls['email'].setValue(value.data!.email);
      this.formGroup.controls['username'].setValue(value.data!.username);

      this.formGroup.controls['username'].disable();
      if (value?.data!.phone) {
        this.formGroup.controls['phone'].disable();
      }
      if (value?.data!.email) {
        this.formGroup.controls['email'].disable();
      }
      if (value.data!.image != null) {
        this.image = value.data!.image;
      }

    });

  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const profile = new Profile({
      firstName: this.formGroup.value.firstName,
      lastName: this.formGroup.value.lastName,
      gender: this.formGroup.value.gender,
      phone: this.formGroup.value.phone,
      title: this.formGroup.value.bio,
      bio: this.formGroup.value.bio
    });
    this.profileService.save(profile);
    if (this.isNewImage === true) {
      this.profileService.save(this.formData);
    }
  }

  override ngOnDestroy(): void {
    this.profileService.unsubscribe();
    this.unSubscription();
  }

  updateImage($event: Event): void {
    const file = ($event.target as HTMLInputElement).files![0];
    this.formGroup.get('image')!.updateValueAndValidity();

    const reader = new FileReader();
    const preview = '';
    reader.onload = () => {
      this.image = reader.result as string;
      this.formData.append('image', file, file.name);
      //  this.formData.append('"_method', "PUT");
      this.isNewImage = true;
    };
    reader.readAsDataURL(file);
  }
}
