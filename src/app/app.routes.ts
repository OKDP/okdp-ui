import { Routes } from '@angular/router';
import { CatalogListServicesComponent } from './features/catalogs';
import { HomeComponent } from './features/home';
import { ErrorComponent } from './shared/error';
import { LoginComponent } from './core/common/login';
import { AuthGuard } from './core/guards';
import { PageLayoutComponent } from './core/layout/page-layout';
import { CATALOG_URI } from './core/constants';
import { ServiceInstancesComponent } from './features/service';
import { ServiceDeployComponent } from './features/service/components/service-deploy/service-deploy.component';
export const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: PageLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: CATALOG_URI, pathMatch: 'full' }, //tmp redirection
      { path: 'home', component: HomeComponent },
      {
        path: CATALOG_URI,
        children: [
          { path: '', component: CatalogListServicesComponent },
          { path: ':catalog', component: CatalogListServicesComponent },
        ],
        // loadChildren: () =>
        //   import('./features/catalogs').then((m) => m.ROUTES_CATALOG),
      },
      {
        path: 'services',
        children: [
          { path: ':service/instances', component: ServiceInstancesComponent },
          { path: ':service/deploy', component: ServiceDeployComponent },
        ],
        // loadChildren: () =>
        //   import('./features/catalogs').then((m) => m.ROUTES_CATALOG),
      },
    ],
  },
  { path: '**', component: ErrorComponent },
];
