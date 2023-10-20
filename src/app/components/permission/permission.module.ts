import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared.module';

import {EditComponent} from './edit/edit.component';
import {AddComponent} from './add/add.component';
import {ListComponent} from './list/list.component';
import {DetailComponent} from './detail/detail.component';
import {PermissionRoutingModule} from "./permission-routing.module";
;

@NgModule({
  declarations: [



    EditComponent,

    AddComponent,

    ListComponent,

    DetailComponent
  ],
  imports: [
    SharedModule,
    PermissionRoutingModule,

  ]
})
export class PermissionModule {
}
