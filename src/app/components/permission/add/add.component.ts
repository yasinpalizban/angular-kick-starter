import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { faStickyNote, faFileWord, faEye} from "@fortawesome/free-solid-svg-icons";
import {PermissionService} from "../../../services/permission.service";
import {Permission} from "../../../models/permission.model";
import {BasicForm} from "../../../abstracts/basic.form";
import {Router} from "@angular/router";
@Component({
  selector: 'app-permission-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent extends BasicForm implements OnInit , OnDestroy{
  faIcon = { faStickyNote, faFileWord,faEye};

  constructor(private formBuilder: FormBuilder,
              private permissionService: PermissionService
              ,protected  override router:Router ) {
 super(router);

  }

  ngOnInit(): void {


    this.formGroup = this.formBuilder.group({

      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      active: new FormControl('', [
        Validators.required,
      ]),
    });


  }

  onSubmit(): void  {


    if (this.formGroup.invalid) {
      return;
    }

    this.submitted = true;
    const permission = new Permission({
      name: this.formGroup.value.name.toLowerCase(),
      description: this.formGroup.value.description,
      active: this.formGroup.value.active == true,

    });

    this.permissionService.clearAlert();
    this.permissionService.save(permission);

  }

  override ngOnDestroy(): void  {

    this.permissionService.unsubscribe();
  }

}
