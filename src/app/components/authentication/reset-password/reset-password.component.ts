import {Component} from '@angular/core';
import {AuthenticateService} from '../../../services/authenticate.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent  {
  constructor(
    private authService: AuthenticateService) {
  }

  onClearAlert(): void {
    this.authService.clearAlert();
  }


}
