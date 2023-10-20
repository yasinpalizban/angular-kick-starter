import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { takeUntil} from 'rxjs';
import {IProfile} from '../../../interfaces/profile.interface';
import {ProfileService} from '../../../services/profile.service';
import {Profile} from '../../../models/profile.model';
import {faMapMarker,faAddressBook, faMap} from "@fortawesome/free-solid-svg-icons";
import {BasicForm} from "../../../abstracts/basic.form";
import {ResponseObject} from "../../../interfaces/response.object.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-address',
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.scss']
})
export class UserAddressComponent extends  BasicForm implements OnInit, OnDestroy {
  faIcon = {
    faMap, faMapMarker,faAddressBook
  };



  profileDetail!: ResponseObject<IProfile>;

  constructor(private formBuilder: FormBuilder,
              private profileService: ProfileService ,
              protected override router: Router) {
  super(router);
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({

      country: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ])
    });


     this.profileService.query().pipe(takeUntil(this.subscription$)).subscribe((profile) => {
      this.profileDetail = profile;
      this.formGroup.controls['country'].setValue(profile.data!.country);
      this.formGroup.controls['city'].setValue(profile.data!.city);
      this.formGroup.controls['address'].setValue(profile.data!.address);
    });


  }

  onSubmit(): void {


    if (this.formGroup.invalid) {
      return;
    }

    this.submitted = true;

    const profile = new Profile({
      address: this.formGroup.value.address,
      country: this.formGroup.value.country,
      city: this.formGroup.value.city,
    });

    this.profileService.save(profile);

  }

  override ngOnDestroy(): void {
    this.profileService.unsubscribe();
    this.unSubscription();
  }

}
