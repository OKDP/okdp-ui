import { Component, ViewEncapsulation, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { select, Store } from '@ngrx/store';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectService } from '../../../../core/common/projects';
import { AppState } from '../../../../core/store';
import { NotificationService } from '../../../../core/common/notifications';
import { LoadingComponent } from '../../../../shared/components/loading';
import { Project, ServerResponse } from '../../../../api/_model';
import { KUBERNETES_OBJECT_PATTERN } from '../../../../core/constants';
import { getClusterId } from '../../../../core/common/clusters';
import { errorMessage } from '../../../../core/models';

@Component({
  selector: 'app-project-create-update',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    DragDropModule,
    MatTooltipModule,
    LoadingComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './projects-create-update.component.html',
  styleUrls: ['./projects-create-update.component.scss'],
})
export class ProjectCreateOrUpdateComponent implements OnInit {
  clusterId: string = '';
  projectName: string = '';

  isLoaded = false;

  isSubmitting: boolean = false;

  projectForm!: FormGroup;
  projectPayload = {
    name: '',
    displayName: '',
    environment: '',
    description: '',
  } as Project;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.projectName = this.route.snapshot.paramMap.get('projectName') as string;

    this.projectForm = this.fb.group({
      name: [this.projectPayload.name, [Validators.required, Validators.pattern(KUBERNETES_OBJECT_PATTERN)]],
      displayName: [this.projectPayload.displayName, Validators.required],
      environment: [this.projectPayload.displayName, Validators.required],
      description: [this.projectPayload.displayName, Validators.required],
    });

    this.store.pipe(select(getClusterId)).subscribe(clusterId => {
      if (clusterId) {
        this.clusterId = clusterId;
        if (this.projectName) {
          this.loadProjectForUpdate(clusterId, this.projectName);
        }
        this.isLoaded = true;
      }
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.projectPayload.name = this.valueOfField('name');
    this.projectPayload.displayName = this.valueOfField('displayName');
    this.projectPayload.environment = this.valueOfField('environment');
    this.projectPayload.description = this.valueOfField('description');

    const handlers = {
      create: () => this.projectService.post(this.clusterId, this.projectPayload),
      update: () => this.projectService.put(this.clusterId, this.projectPayload),
    };

    const action = this.isCreate ? 'create' : 'update';

    handlers[action]()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (_: ServerResponse) => {
          this.notificationService.onSuccess(
            `${this.projectPayload.name}/${this.projectPayload.displayName}`,
            `project ${action}d successfully.`
          );
          this.isSubmitting = false;
          this.goBack();
        },
        error: error => {
          this.notificationService.onError(
            `${this.projectPayload.name}/${this.projectPayload.displayName}`,
            `project was failed to ${action}, ${errorMessage(error)}`
          );
          this.isSubmitting = false;
          this.goBack();
        },
      });
  }

  get isValid() {
    return this.projectForm.valid;
  }

  isFieldValid(name: string): boolean {
    const control = this.projectForm.get(name);
    return !(control?.invalid && (control.touched || control.dirty || !control.value));
  }

  valueOfField(name: string): string {
    const control = this.projectForm.get(name) as FormGroup;
    return control.value;
  }

  get isCreate(): boolean {
    return !this.projectName?.trim();
  }

  private loadProjectForUpdate(clusterId: string, projectName: string): void {
    this.projectService
      .get(clusterId, projectName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (project: Project) => {
          this.projectPayload = project;
          this.populateForm();
        },
        error: error => {
          this.notificationService.onError(`${projectName}`, `project was failed to load, ${errorMessage(error)}`);
        },
      });
  }

  private populateForm(): void {
    this.projectForm.patchValue({
      name: this.projectPayload.name,
      displayName: this.projectPayload.displayName,
      environment: this.projectPayload.environment,
      description: this.projectPayload.description,
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
