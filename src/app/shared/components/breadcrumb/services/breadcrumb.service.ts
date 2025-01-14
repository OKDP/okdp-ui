// https://stackoverflow.com/questions/77765006/how-can-i-create-breadcrumb-in-angular

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';
import { BreadcrumbItem } from '../model/breadcrumb-item.model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  breadcrumbs: Observable<BreadcrumbItem[]>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.breadcrumbs = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map(_ => this.createBreadcrumbs(this.activatedRoute.root))
    );
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<BreadcrumbItem> = []
  ): Array<BreadcrumbItem> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }
      breadcrumbs.push({ label: child.snapshot.data['breadcrumb'], url: url });
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}
