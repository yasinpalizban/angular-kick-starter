import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticateCheckerService} from "../services/authenticate.checker.service";
import {IAuth} from "../interfaces/authenticate.interface";


@Injectable({
  providedIn: 'root'
})
export class AuthActivateChildGuard implements CanActivate {

  constructor(private authService: AuthenticateCheckerService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user: IAuth = this.authService.authValue;
    let isAllowed: boolean = false;

    for (const permission of user.permissions!) {

      if (route.data['permissionName'].toLowerCase() === permission.name.toLowerCase()) {
        if (!permission.active) {
          user.permissionGroup?.forEach(groupPermission => {
            if (groupPermission.permissionId === permission.id && groupPermission.groupId == user.role?.id) {
              isAllowed = true;
              return;
            }
          });
        } else {
          user.permissionGroup?.forEach(groupPermission => {
            if (groupPermission.permissionId === permission.id) {
              groupPermission.actions.split("-")
                .forEach(value => {
                  if (value.toLowerCase() === route.data['permission'].toLowerCase()) {
                    isAllowed = true;
                  }
                });
              return;
            }
          });
          user.permissionUser?.forEach(userPermission => {
            if (userPermission.permissionId === permission.id) {
              userPermission.actions.split("-")
                .forEach(value => {
                  if (value.toLowerCase() === route.data['permission'].toLowerCase())
                    isAllowed = true;
                });
              return;
            }

          });
        }
      }
    }


    if (!isAllowed) {
      this.router.navigate(['./403']).then();
    }

    return true;
  }
}


