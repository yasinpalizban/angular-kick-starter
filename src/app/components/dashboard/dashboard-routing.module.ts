import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminAreaComponent} from "../admin-area/admin-area.component";
import {RoleType} from "../../enums/role.enum";
import {PermissionType} from "../../enums/permission.enum";
import {OverViewComponent} from "./over-view/over-view.component";
import {GraphComponent} from "./graph/graph.component";
import {AuthActivateChildGuard} from "../../guards/auth.activate.child.guard";
import {AuthActivateGuard} from "../../guards/auth.activate.guard";


const routes: Routes = [

  {
    path: 'dashboard',
    component: AdminAreaComponent,
    canActivate: [AuthActivateGuard],
    children: [
      {
        path: 'graph',
        component: GraphComponent,
        canActivate: [AuthActivateChildGuard],
        data: {
          roles: [RoleType.Admin, RoleType.Coworker, RoleType.Blogger],
          permission: PermissionType.Get,
          permissionName: "graph"

        },
      },
      {
        path: 'over-view',
        component: OverViewComponent,
        canActivate: [AuthActivateChildGuard],
        data: {
          roles: [RoleType.Admin, RoleType.Coworker, RoleType.Blogger],
          permission: PermissionType.Get,
          permissionName: "overView"

        },
      },
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
