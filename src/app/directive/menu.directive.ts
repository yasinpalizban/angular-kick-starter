import {Directive, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticateCheckerService} from "../services/authenticate.checker.service";
import {IAuth} from "../interfaces/iauthenticate";
import {isValidToPassAuth} from "../utils/is.valid.to.pass.auth";
import {PermissionType} from "../enums/permission.enum";
import {GlobalConstants} from "../configs/global-constants";

@Directive({
  selector: '[appMenu]'
})
export class MenuDirective implements OnInit {
  @Input('category') category: string = '';
  limitUserMenu = GlobalConstants.limitUserMenu;

  constructor(private el: ElementRef, private authService: AuthenticateCheckerService,) {
  }

  ngOnInit(): void {
    const user: IAuth = this.authService.authValue;
    const permissionList: string[] = this.limitUserMenu[this.category];
    this.el.nativeElement.style.display = 'none';
    for (let i = 0; i < permissionList.length; i++) {
      if (isValidToPassAuth(permissionList[i], PermissionType.Get, user)) {
        this.el.nativeElement.style.display = 'block';
        break;
      }
    }

  }
}
