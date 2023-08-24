import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

 import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
// import {ButtonsModule} from 'ngx-bootstrap/buttons';
// import {AlertModule} from 'ngx-bootstrap/alert';
import {CollapseModule} from 'ngx-bootstrap/collapse';
// import {TabsModule} from 'ngx-bootstrap/tabs';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {CarouselModule} from 'ngx-bootstrap/carousel';


@NgModule({
  imports: [
    CommonModule,
    // AlertModule.forRoot(),
     BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    // ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    // TabsModule.forRoot(),
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    AccordionModule.forRoot(),

  ],
  exports: [
     BsDropdownModule,
    TooltipModule,
    ModalModule,
    // ButtonsModule,
    // AlertModule,
    CollapseModule,
    // TabsModule,
    PaginationModule,
    CarouselModule,
    AccordionModule,


  ]
})
export class BootstrapModule {
}
