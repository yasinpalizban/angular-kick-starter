import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminAreaComponent} from '../admin-area/admin-area.component';
import {RoleType} from '../../enums/role.enum';
import {PermissionType} from '../../enums/permission.enum';
import {EditComponent} from './edit/edit.component';
import {AddComponent} from './add/add.component';
import {ListComponent} from './list/list.component';
import {AuthActivateChildGuard} from "../../guards/auth.activate.child.guard";
import {AuthActivateGuard} from "../../guards/auth.activate.guard";
import {DetailComponent} from './detail/detail.component';


const routes: Routes = [

  {
    path: 'group',
    component: AdminAreaComponent,
    canActivate: [AuthActivateGuard],
    children: [
      {
        path: 'add',
        component: AddComponent,
        canActivate: [AuthActivateChildGuard],
        data: {
          permission: PermissionType.Post,
          permissionName: "group"
        }
      },

      {
        path: 'edit/:id',
        component: EditComponent,
        canActivate: [AuthActivateChildGuard],
        data: {
          roles: [RoleType.Admin],
          permission: PermissionType.Put,
          permissionName: "group"
        }
      },

      {
        path: 'list',
        component: ListComponent,
        canActivate: [AuthActivateChildGuard],
        data: {
          permission: PermissionType.Get,
          permissionName: "group"
        }
      },
      {
        path: 'detail/:id',
        component: DetailComponent,
        canActivate: [AuthActivateChildGuard],
        data: {
          permission: PermissionType.Get,
          permissionName: "group"
        }
      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule {
}
