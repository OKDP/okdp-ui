import { Routes } from '@angular/router';
import { CatalogListPackagesComponent } from './features/catalogs';
import { HomeComponent } from './features/home';
import { ErrorComponent } from './shared/error';
import { LoginComponent } from './core/common/login';
import { AuthGuard } from './core/guards';
import { PageLayoutComponent } from './core/layout/page-layout';
import { ReleaseListCardComponent, ReleaseCreateUpdateComponent } from './features/releases';
import {
  ProjectCreateOrUpdateComponent,
  ProjectListCardComponent,
  ProjectListTableComponent,
} from './features/projects';
import { ReleaseListTableComponent } from './features/releases/components/releases-list-table/release-list-table.component';
import { PackageSelectComponent } from './features/releases/components/package-select/package-select.component';
import { StepperComponent } from './shared/components/stepper';
import { ProjectListComponent } from './features/projects/shared';
import { ReleaseListComponent } from './features/releases/shared';

export const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: PageLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'projects',
        component: ProjectListComponent,
        children: [
          { path: '', component: ProjectListTableComponent },
          { path: 'table', component: ProjectListTableComponent },
          { path: 'card', component: ProjectListCardComponent },
        ],
      },
      {
        path: 'projects',
        children: [
          { path: 'add', component: ProjectCreateOrUpdateComponent },
          { path: ':projectName/update', component: ProjectCreateOrUpdateComponent },
        ],
      },
      {
        path: 'services/:service',
        component: ReleaseListComponent,
        children: [
          { path: '', redirectTo: 'instances', pathMatch: 'full' },
          { path: 'instances', component: ReleaseListTableComponent },
          { path: 'instances/table', component: ReleaseListTableComponent },
          { path: 'instances/card', component: ReleaseListCardComponent },
        ],
      },
      {
        path: 'services/:service/instances/:serviceInstance/update',
        component: ReleaseCreateUpdateComponent,
      },
      {
        path: 'services',
        component: StepperComponent,
        children: [
          { path: ':catalog/select', component: PackageSelectComponent, data: { step: 'Select Service' } },
          {
            path: ':service/create',
            component: ReleaseCreateUpdateComponent,
            data: { step: 'Configure', info: 'Deploy' },
          },
        ],
      },
      {
        path: 'catalogs',
        children: [
          { path: '', component: CatalogListPackagesComponent },
          { path: 'card', component: CatalogListPackagesComponent },
          { path: ':catalog', component: CatalogListPackagesComponent },
          { path: ':catalog/card', component: CatalogListPackagesComponent },
        ],
        // loadChildren: () =>
        //   import('./features/catalogs').then((m) => m.ROUTES_CATALOG),
      },
    ],
  },
  { path: '**', component: ErrorComponent },
];
