import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { takeUntil} from 'rxjs';
import {IProfile} from '../../../interfaces/profile.interface';
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
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {Router} from "@angular/router";


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent extends BasicForm implements OnInit, OnDestroy {
  faIcon = {
    faPhone,
    faUser, faEnvelope, faVenusMars,
    faStickyNote
  };

  profileDetail!: ResponseObject<IProfile>;
  image: SafeUrl | string='assets/images/icon/default-avatar.jpg';
  isNewImage: boolean=false;
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

  ngOnInit(): void {
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

    this.profileService.query().pipe(takeUntil(this.subscription$)).subscribe((profile) => {
      this.profileDetail = profile;
      this.formGroup.controls['firstName'].setValue(profile.data!.firstName);
      this.formGroup.controls['lastName'].setValue(profile.data!.lastName);
      this.formGroup.controls['gender'].setValue(profile.data!.gender);
      this.formGroup.controls['phone'].setValue(profile.data!.phone);
      this.formGroup.controls['title'].setValue(profile.data!.title);
      this.formGroup.controls['bio'].setValue(profile.data!.bio);
      this.formGroup.controls['email'].setValue(profile.data!.email);
      this.formGroup.controls['username'].setValue(profile.data!.username);

      this.formGroup.controls['username'].disable();
      if (profile?.data!.phone) {
        this.formGroup.controls['phone'].disable();
      }
      if (profile?.data!.email) {
        this.formGroup.controls['email'].disable();
      }
      if (profile.data!.image != null) {
        this.image = profile.data!.image;
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

    // const fileReader = new FileReader();
    // const element = $event.currentTarget as HTMLInputElement;
    // this.image = this.sanitizer.bypassSecurityTrustUrl(
    //   window.URL.createObjectURL(element.files[0])
    // );
    // this.formGroup.patchValue({
    //   image: element.files[0]
    // });
    // this.formGroup.query('image').updateValueAndValidity();
    // File Preview
    // const reader = new FileReader();
    // let preview = "";
    // reader.onload = () => {
    //   preview = reader.result as string;
    // }
    // reader.readAsDataURL(element.files[0])


    const file = ($event.target as HTMLInputElement).files![0];

    this.formGroup.get('image')!.updateValueAndValidity();

    // File Preview
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
