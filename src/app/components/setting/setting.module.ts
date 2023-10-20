import {NgModule} from '@angular/core';
import {SettingRoutingModule} from './setting-routing.module';
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
    SettingRoutingModule,

  ]
})
export class SettingModule {
}
