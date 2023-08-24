import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WebSiteComponent} from '../web-site/web-site.component';
import {HomeComponent} from './home.component';



const routes: Routes = [

  {
    path: '',
    component: WebSiteComponent, children: [
      {path: 'main', component: HomeComponent},


    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
