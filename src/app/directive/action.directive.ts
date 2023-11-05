import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {AuthenticateCheckerService} from "../services/authenticate.checker.service";
import {IAuth} from "../interfaces/iauthenticate.interface";
import {isValidToPassAuth} from "../utils/is.valid.to.pass.auth";

@Directive({
  selector: '[appActions]'
})
export class ActionDirective implements OnInit {
  @Input('permissionType') permissionType: string = '';
  @Input('permissionName') permissionName: string = '';

  constructor(private el: ElementRef, private authService: AuthenticateCheckerService,) {
  }
  ngOnInit(): void {
    const user: IAuth = this.authService.authValue;
    if (!isValidToPassAuth(this.permissionName, this.permissionType, user)) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
