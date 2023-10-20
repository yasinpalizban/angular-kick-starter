import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared.module';
import {AdminAreaComponent} from './admin-area.component';
import {AdminAreaRoutingModule} from './admin-area-routing.module';
import {SettingModule} from '../setting/setting.module';
import {ProfileModule} from '../profile/profile.module';
import {GroupModule} from '../group/group.module';
import {UserModule} from '../users/user.module';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {DashboardModule} from "../dashboard/dashboard.module";
import {PermissionModule} from "../permission/permission.module";
import {PermissionGroupModule} from "../permission-group/permission.group.module";
import {PermissionUserModule} from "../permission-user/permission.user.module";
@NgModule({
  declarations: [
    AdminAreaComponent,
    HeaderComponent,
    FooterComponent,

  ],

  imports: [
    SharedModule,
    AdminAreaRoutingModule,
    DashboardModule,
    ProfileModule,
    SettingModule,
    GroupModule,
    UserModule,
    PermissionModule,
    PermissionGroupModule,
    PermissionUserModule,
  ]
})
export class AdminAreaModule {
}
