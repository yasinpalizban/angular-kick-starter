
import {MainAbstract} from "./main.abstract";
import {Component, HostListener} from "@angular/core";
import {LocationChangeListener} from "@angular/common";
import {Router} from "@angular/router";
@Component({ template: '' })

export class BasicDetail extends MainAbstract {
  protected id: number = 0;
  protected params: any;
  protected path:string='';
  @HostListener('window:popstate', ['$event'])
  onPopState(event: LocationChangeListener): void {
    this.router.navigateByUrl('./admin/' + this.path + '/list' + this.params).then();
  }

  constructor(protected router: Router) {
    super();
  }


}
