import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {GroupService} from '../../../services/group.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs';
import {IGroup} from '../../../interfaces/igroup';
import {IQuery} from '../../../interfaces/iquery';
import {Group} from '../../../models/group.model';
import {faFileWord, faStickyNote} from "@fortawesome/free-solid-svg-icons";
import {BasicForm} from "../../../abstracts/basic.form";
import {GROUP_SERVICE} from "../../../configs/path.constants";

@Component({
  selector: 'app-group-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends BasicForm implements OnInit, OnDestroy {
  faIcon = {faStickyNote, faFileWord};
  group!: IGroup;

  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService,
              private activatedRoute: ActivatedRoute,
              protected override router: Router) {
    super(router);
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  private initData(): void {
    this.activatedRoute.params.pipe(takeUntil(this.subscription$),
      switchMap((params) => this.groupService.detail(+params['id'])
      )).subscribe((value) => {
      this.group =value.data;
      this.formGroup.controls['name'].setValue(value.data.name);
      this.formGroup.controls['description'].setValue(value.data.description);
    });

    this.groupService.getQueryArgumentObservable().pipe(takeUntil(this.subscription$)).subscribe((qParams: IQuery) => {
      this.params = qParams;
      this.path = GROUP_SERVICE.base;
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const group = new Group({
      id: this.editId,
      name: this.formGroup.value.name.toLowerCase(),
      description: this.formGroup.value.description,
    });
    this.groupService.clearAlert();
    this.groupService.update(group, this.params);
  }

  override ngOnDestroy(): void {
    this.unSubscription();
    this.groupService.unsubscribe();
  }
}
