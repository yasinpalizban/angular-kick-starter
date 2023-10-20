import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Auth} from '../../../models/authenticate.model';
import {AuthenticateService} from '../../../services/authenticate.service';
import {BasicForm} from "../../../abstracts/basic.form";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BasicForm implements OnInit, OnDestroy {
  remember: boolean;

  constructor(private authenticateService: AuthenticateService
              ,protected  override router: Router
  ) {
    super(router);
    this.remember = false;
  }

  ngOnInit(): void {

    this.authenticateService.isSignIn();

  }

  onSubmit(ngForm: NgForm): void {

    if (ngForm.invalid) {
      return;
    }
    const auth = new Auth({login: ngForm.value.login, password: ngForm.value.password, remember: this.remember});
    this.authenticateService.signIn(auth);

    // ngForm.reset();
  }


  override ngOnDestroy(): void {
    this.authenticateService.unsubscribe();
  }
}
