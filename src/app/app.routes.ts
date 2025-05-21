import { Routes } from '@angular/router';
import { CatalogListPackagesComponent } from './features/catalogs';
import { HomeComponent } from './features/home';
import { ErrorComponent } from './shared/error';
import { LoginComponent } from './core/common/login';
import { AuthGuard } from './core/guards';
import { PageLayoutComponent } from './core/layout/page-layout';
import { CATALOG_URI } from './core/constants';
import { ReleaseInstancesComponent } from './features/releases';
import { ReleaseDeployComponent } from './features/releases/components/release-deploy/release-deploy.component';
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
          { path: '', component: CatalogListPackagesComponent },
          { path: ':catalog', component: CatalogListPackagesComponent },
        ],
        // loadChildren: () =>
        //   import('./features/catalogs').then((m) => m.ROUTES_CATALOG),
      },
      {
        path: 'services',
        children: [
          { path: ':service/instances', component: ReleaseInstancesComponent },
          { path: ':service/deploy', component: ReleaseDeployComponent },
        ],
        // loadChildren: () =>
        //   import('./features/catalogs').then((m) => m.ROUTES_CATALOG),
      },
    ],
  },
  { path: '**', component: ErrorComponent },
];
