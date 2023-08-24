import {Component, OnInit} from '@angular/core';

import {ProfileService} from '../../services/profile.service';
import {faList} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-dashboard',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  faIcon={faList};
  constructor(private profileService: ProfileService) {
  }

  ngOnInit(): void {

  }

  onClearAlert(): void {
    this.profileService.clearAlert();
  }


}
