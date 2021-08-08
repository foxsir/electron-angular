import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

const routes: Routes = [
  {path: '', loadChildren: () => import('@modules/session/session.module').then(m => m.SessionModule)},
  {path: 'session', loadChildren: () => import('@modules/session/session.module').then(m => m.SessionModule)},
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
