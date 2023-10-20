import {FormGroup} from '@angular/forms';
import {MainAbstract} from "./main.abstract";
import {HostListener, Injectable} from "@angular/core";
import {LocationChangeListener} from "@angular/common";
import {Router} from "@angular/router";
import {isEmpty} from "../utils/is.empty";

@Injectable()
export class BasicForm extends MainAbstract {
  protected formGroup!: FormGroup;
  protected submitted: boolean = false;
  protected editId: number = 0;
  protected params: any;
  protected path: string = '';

  @HostListener('window:popstate', ['$event'])
  onPopState(event: LocationChangeListener): void {
    if (!isEmpty(this.params) && !isEmpty(this.path))
      this.router.navigateByUrl('./admin/' + this.path + '/list' + this.params).then();
  }

  constructor(protected router: Router) {
    super();
  }


}
