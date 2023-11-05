import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RoleType} from "../../enums/role.enum";
import {AuthenticateCheckerService} from "../../services/authenticate.checker.service";
import {IAuth} from "../../interfaces/iauthenticate.interface";
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

    setTimeout(() => {
      this.router.navigate(['./admin/profile'],);
    }, 5000);
  }

}
