import {NgModule} from '@angular/core';
import {WebSiteRoutingModule} from './web-site-routing.module';

import {WebSiteComponent} from './web-site.component';
import {SharedModule} from '../../shared.module';
import {AuthenticateModule} from '../authentication/authenticate.module';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {HomeModule} from '../home/home.module';

@NgModule({
  declarations: [
    WebSiteComponent,
    HeaderComponent,
    FooterComponent


  ],
  imports: [

    SharedModule,
    AuthenticateModule,
    HomeModule,
    WebSiteRoutingModule,

  ]
})
export class WebSiteModule {
}
