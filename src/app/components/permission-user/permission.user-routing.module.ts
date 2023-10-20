import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminAreaComponent} from '../admin-area/admin-area.component';
import {PermissionType} from '../../enums/permission.enum';
import {EditComponent} from './edit/edit.component';
import {AddComponent} from './add/add.component';
import {ListComponent} from './list/list.component';
import {DetailComponent} from './detail/detail.component';
import {AuthActivateChildGuard} from "../../guards/auth.activate.child.guard";
import {AuthActivateGuard} from "../../guards/auth.activate.guard";


const routes: Routes = [

  {
    path: 'permission-user',
    component: AdminAreaComponent,
    canActivate: [AuthActivateGuard],
    children: [
      {
        path: 'add',
        component: AddComponent,
        canActivate: [AuthActivateChildGuard],
        data: {
          permission: PermissionType.Post,
          permissionName: "permissionUser"

        },
      },
      {
        path: 'edit/:id',
        component: EditComponent,
        canActivate: [AuthActivateChildGuard],
        data: {
          permission: PermissionType.Put,
          permissionName: "permissionUser"

        },
      },
      {
        path: 'list',
        component: ListComponent,
        canActivate: [AuthActivateChildGuard],
        data: {
          permission: PermissionType.Get,
          permissionName: "permissionUser"

        },
      },
      {
        path: 'detail/:id',
        component: DetailComponent,
        canActivate: [AuthActivateChildGuard],
        data: {
          permission: PermissionType.Get,
          permissionName: "permissionUser"

        },
      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionUserRoutingModule {
}
