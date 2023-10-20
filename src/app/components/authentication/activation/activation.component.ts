import {Component} from '@angular/core';
import {AuthenticateService} from '../../../services/authenticate.service'
@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent  {
  constructor(private authService: AuthenticateService) {
  }

  onClearAlert(): void {
    this.authService.clearAlert();
  }

}
