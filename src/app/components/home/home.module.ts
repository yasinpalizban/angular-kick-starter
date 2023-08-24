import {NgModule} from '@angular/core';
import {HomeRoutingModule} from './home-routing.module';
import {SharedModule} from '../../shared.module';
import {HomeComponent} from './home.component';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  declarations: [
    HomeComponent,


  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
    NgxPayPalModule

  ]
})
export class HomeModule {
}
