import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {NotFoundPageComponent} from './components/not-found-page/not-found-page.component';
import {ForbiddenPageComponent} from './components/forbidden-page/forbidden-page.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/home/main', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import(`./components/web-site/web-site.module`).then(m => m.WebSiteModule)},
   {path: 'admin', loadChildren: () => import(`./components/admin-area/admin-area.module`).then(m => m.AdminAreaModule)},
  {path: '404', component: NotFoundPageComponent},
  {path: '403', component: ForbiddenPageComponent},
  {path: '**', redirectTo: '/404'},
  // { path: '**', component:NotFoundPageComponent }

];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
    // RouterModule.forRoot(appRoutes)
    //  RouterModule.forRoot(appRoutes,{ enableTracing: false })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
