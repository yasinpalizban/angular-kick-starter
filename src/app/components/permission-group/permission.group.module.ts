import {NgModule} from '@angular/core';

import {SharedModule} from '../../shared.module';

import {EditComponent} from './edit/edit.component';
import {AddComponent} from './add/add.component';
import {ListComponent} from './list/list.component';
import {DetailComponent} from './detail/detail.component';
import {SearchComponent} from './search/search.component';

import {PermissionGroupRoutingModule} from "./permission.group-routing.module";
import {PermissionGroupComponent} from "./permission.group.component";

@NgModule({
  declarations: [

    PermissionGroupComponent,

    EditComponent,

    AddComponent,

    ListComponent,

    SearchComponent,
    DetailComponent
  ],
  imports: [
    SharedModule,
    PermissionGroupRoutingModule,

  ]
})
export class PermissionGroupModule {
}
