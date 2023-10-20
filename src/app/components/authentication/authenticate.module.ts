import {NgModule} from '@angular/core';
import {AuthenticateRoutingModule} from './authenticate-routing.module';
import {SharedModule} from '../../shared.module';
import {LoginComponent} from './login/login.component';
import {ForgotComponent} from './forgot/forgot.component';
import {RegisterComponent} from './register/register.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {LogoutComponent} from './logout/logout.component';
import {ActivationComponent} from './activation/activation.component';
import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from "ng-recaptcha";
import {environment} from "../../../environments/environment";
import {ActivationViaEmailComponent} from "./activation/via-email/activation.via.email.component";
import {ActivationViaSmsComponent} from "./activation/via-sms/activation.via.sms.component";
import {ResetPasswordViaEmailComponent} from "./reset-password/via-email/reset.password.via.email.component";
import {ResetPasswordViaSmsComponent} from "./reset-password/via-sms/reset.password.via.sms.component";



@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    ForgotComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ActivationComponent,
    ActivationViaEmailComponent,
    ActivationViaSmsComponent,
    ResetPasswordViaEmailComponent,
    ResetPasswordViaSmsComponent,

  ],
  imports: [
    SharedModule,
    AuthenticateRoutingModule,
    RecaptchaV3Module,

  ],
  providers: [{provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.captcha.siteKey}],
})
export class AuthenticateModule {
}
