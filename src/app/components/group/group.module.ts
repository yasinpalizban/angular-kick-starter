import {NgModule} from '@angular/core';
import {GroupRoutingModule} from './group-routing.module';
import {SharedModule} from '../../shared.module';
 import {EditComponent} from './edit/edit.component';
 import {AddComponent} from './add/add.component';
import {ListComponent} from './list/list.component';
 import {DetailComponent} from './detail/detail.component';


@NgModule({
  declarations: [

    EditComponent,
    AddComponent,
    ListComponent,
    DetailComponent,

  ],
  imports: [
    SharedModule,
    GroupRoutingModule,

  ]
})
export class GroupModule {
}
