import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticateCheckerService} from "../services/authenticate.checker.service";
import {IAuth} from "../interfaces/iauthenticate";
import {isValidToPassAuth} from "../utils/is.valid.to.pass.auth";


@Injectable({
  providedIn: 'root'
})
export class AuthActivateChildGuard implements CanActivate {

  constructor(private authService: AuthenticateCheckerService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user: IAuth = this.authService.authValue;
    const isAllowed = isValidToPassAuth(route.data['permissionName'], route.data['permission'],user);
    if (!isAllowed) {
      this.router.navigate(['./403']).then();
    }
    return isAllowed;
  }


}


