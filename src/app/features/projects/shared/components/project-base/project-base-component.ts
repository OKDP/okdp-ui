import {
  catchError,
  EMPTY,
  filter,
  interval,
  map,
  Observable,
  of,
  switchMap,
  take,
  takeWhile,
  tap,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../../core/common/notifications';
import { getProjectName, loadProjectFailure, ProjectService, selectProject } from '../../../../../core/common/projects';
import { Project, ServerResponse } from '../../../../../api/_model';
import { AppState } from '../../../../../core/store';
import { getClusterId } from '../../../../../core/common/clusters';
import { SearchFilterService } from '../../../../../shared/components/search-filter';
import { errorMessage } from '../../../../../shared/utils';

@Injectable()
export abstract class AbstractProjectBaseComponent {
  protected readonly projectService = inject(ProjectService);
  protected readonly notificationService = inject(NotificationService);
  protected readonly searchFilterService = inject(SearchFilterService);
  protected readonly store = inject<Store<AppState>>(Store<AppState>);
  protected readonly destroyRef = inject(DestroyRef);
  private router = inject(Router);

  protected currentProjectName: string;
  protected clusterId: string = '';
  protected isLoaded = false;

  // Deletion
  protected showDialog = false;
  protected selectedProject: string = '';

  // Filter
  protected instances: Project[] = [];
  protected filtredInstances: Project[] = [];
  search = '';

  abstract updateDataSource(projects: Project[]): void;

  onInit(): void {
    this.isLoaded = false;

    this.store.pipe(select(getProjectName), takeUntilDestroyed(this.destroyRef)).subscribe(projectName => {
      if (!projectName) {
        this.store.dispatch(selectProject({ projectName: 'default' }));
      } else {
        this.currentProjectName = projectName;
      }
    });

    this.store
      .pipe(
        select(getClusterId),
        takeUntilDestroyed(this.destroyRef),
        filter((clusterId): clusterId is string => Boolean(clusterId)),
        tap(clusterId => {
          this.isLoaded = false;
          this.clusterId = clusterId;
        }),
        switchMap(() => this.loadProjects()),
        tap(() => {
          this.isLoaded = true;
        }),
        catchError(err => {
          this.notificationService.onError('Projects', '', '', `Failed to load projects: ${err.message || err}`);
          this.isLoaded = false;
          return EMPTY;
        })
      )
      .subscribe();

    this.searchFilterService.globalSearchFilter$.subscribe({
      next: (search: string) => {
        this.searchChanged(search);
      },
      error: error => {
        this.notificationService.onError('search', '', '', `Search error, ${errorMessage(error)}`);
      },
    });
  }

  protected loadProjects(): Observable<Project[]> {
    return this.projectService.listProjects(this.clusterId).pipe(
      tap(projects => {
        this.instances = projects;
        this.updateDataSource(projects);
        this.searchChanged(this.search);
      }),
      catchError(error => {
        this.store.dispatch(
          loadProjectFailure({
            error: `Failed to load project: ${error.message}`,
          })
        );
        return of([]);
      })
    );
  }

  protected add(): void {
    let parentUrl = this.router.url;
    parentUrl = parentUrl.replace(/\/(table|card)$/, '');
    this.router.navigate([`/${parentUrl}/add`]);
  }

  protected edit(projectName: string) {
    let parentUrl = this.router.url;
    parentUrl = parentUrl.replace(/\/(table|card)$/, '');
    this.router.navigate([`/${parentUrl}/${projectName}/update`]);
  }

  protected switch(projectName: string) {
    this.store.dispatch(selectProject({ projectName: projectName }));
  }

  protected isCurrentProject(project: Project): boolean {
    return project.name === this.currentProjectName;
  }

  protected onDeleteProject(projectName: string) {
    this.selectedProject = projectName;
    this.showDialog = true;
  }

  onConfirmDelete() {
    this.showDialog = false;

    if (!this.selectedProject) return;

    this.delete(this.selectedProject);

    this.selectedProject = '';
  }

  onCancelDelete() {
    this.showDialog = false;
    this.selectedProject = '';
  }

  protected delete(projectName: string): void {
    this.deleteProject(this.clusterId, projectName)
      .pipe(
        switchMap(() =>
          interval(2000).pipe(
            switchMap(() => this.loadProjects().pipe(map(projects => projects.find(p => p.name === projectName)))),
            takeWhile(project => !!project, true),
            filter(project => !project),
            take(1),
            tap(() => {
              this.notificationService.onSuccess('Projects', '', '', `Project "${projectName}" deleted.`);
            }),
            catchError(error => {
              this.notificationService.onError('Projects', '', '', `Failed during project polling: ${error.message}`);
              return of(null);
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected deleteProject(clusterId: string, projectName: string): Observable<ServerResponse> {
    return this.projectService.delete(clusterId, projectName).pipe(
      tap(() => {
        this.notificationService.onSuccess(projectName, '', '', 'Project deleted successfully.');
      }),
      catchError(error => {
        this.notificationService.onError(projectName, '', '', `Failed to delete project, ${errorMessage(error)}`);
        return throwError(() => error);
      })
    );
  }

  searchChanged(search: string): void {
    this.search = search;
    if (!search) {
      this.filtredInstances = this.instances;
    } else {
      this.filtredInstances = this.instances.filter(
        instance =>
          instance.name.toLowerCase().includes(search.toLowerCase()) ||
          instance.displayName?.toLowerCase().includes(search.toLowerCase()) ||
          instance.environment?.toLowerCase().includes(search.toLowerCase()) ||
          instance.description?.toLowerCase().includes(search.toLowerCase()) ||
          instance.creationTimestamp?.includes(search.toLowerCase())
      );
    }

    this.updateDataSource(this.filtredInstances);
  }
}
