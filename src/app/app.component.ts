import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LocalizationService} from "./translate/localization.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'test-app';

  constructor(private router: Router,
              private localizationService: LocalizationService,
  ) {

    localStorage.setItem('lang', 'en');
    this.localizationService.initService();

  }
  ngOnInit(): void {
  }


}
