import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

const routes: Routes = [
  {path: '', loadChildren: () => import('@modules/login/login.module').then(m => m.LoginModule)},
  {path: 'login', loadChildren: () => import('@modules/login/login.module').then(m => m.LoginModule)},
  {path: 'home', loadChildren: () => import('@modules/home/home.module').then(m => m.HomeModule)},
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
