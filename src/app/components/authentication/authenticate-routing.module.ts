import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {WebSiteComponent} from '../web-site/web-site.component';
import {ForgotComponent} from './forgot/forgot.component';
import {RegisterComponent} from './register/register.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {LogoutComponent} from './logout/logout.component';
import {ActivationComponent} from './activation/activation.component';
import {RegisterSocialComponent} from "./register-social/register-social.component";


const routes: Routes = [

  {
    path: '',
    component: WebSiteComponent, children: [
      {path: 'sign-in', component: LoginComponent},
      {path: 'sign-out', component: LogoutComponent},
      {path: 'forgot', component: ForgotComponent},
      {path: 'sign-up', component: RegisterComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: 'activation', component: ActivationComponent},
      {path: 'sign-up-social', component: RegisterSocialComponent},

    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticateRoutingModule {
}
