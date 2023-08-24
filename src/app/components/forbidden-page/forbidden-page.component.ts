import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RoleType} from "../../enums/role.enum";
import {AuthenticateCheckerService} from "../../services/authenticate.checker.service";
import {IAuth} from "../../interfaces/authenticate.interface";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-forbidden-page',
  templateUrl: './forbidden-page.component.html',
  styleUrls: ['./forbidden-page.component.scss']
})
export class ForbiddenPageComponent implements OnInit {
  subscription: Subscription;

  constructor(private router: Router, private authService: AuthenticateCheckerService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    const user: IAuth = this.authService.authChange.value;

    // let pathRedirect = './admin/dashboard/over-view';
    // if (user.role?.name == RoleType.Member) {
    //   pathRedirect = './admin/profile';
    // }

     const pathRedirect = './admin/profile';

    setTimeout(() => {
      this.router.navigate([pathRedirect],);
    }, 2000);
  }

}
