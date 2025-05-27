import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatButtonModule } from '@angular/material/button';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../core/auth';
import { errorMessage, UserInfo } from '../../../../core/models';
import { RightSidebarService, RightSidebarToggle } from '../../../../shared/services';
import {
  sortVersionsDesc,
  getLatestVersion,
  toJsonSchemaProperties,
  JsonSchemaProperty,
  deflateParameters,
} from '../../../../shared/utils';
import { GitReleaseService } from '../../services/git-release.service';
import { K8sReleaseService } from '../../services/k8s-release.service';
import { AppState } from '../../../../core/store';
import { getClusterId } from '../../../../core/common/clusters';
import { Release, ServerResponse } from '../../../../api/_model';
import { CatalogItem } from '../../../catalogs/models/catalog-item.model';
import { AppConfigService } from '../../../../core/config';
import { LoadingComponent } from '../../../../shared/components/loading';
import { NotificationService } from '../../../../core/common/notifications';
import { CatalogService } from '../../../../core/common/catalogs';
import { KUBERNETES_OBJECT_PATTERN } from '../../../../core/constants';

@Component({
  selector: 'app-release-deploy',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    LoadingComponent,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './release-deploy.component.html',
  styleUrls: ['./release-deploy.component.scss'],
})
export class ReleaseDeployComponent implements OnInit {
  catalogItem: CatalogItem = {
    catalogId: '',
    name: 'Loading ...',
    icon: '',
    home: '',
  };
  clusterId: string = '';

  readonly userInfo: UserInfo;
  isLoaded = false;
  submissionMode: string;
  isSubmitting: boolean = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  releaseForm!: FormGroup;
  parameterProperties: JsonSchemaProperty[];

  repoUrl: string = '';
  availableTags: string[] = [];

  releasePayload = {
    apiVersion: 'kubocd.kubotal.io/v1alpha1',
    kind: 'Release',
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {
      package: {
        repository: '',
        tag: '',
      },
      targetNamespace: 'default',
      createNamespace: false,
      parameters: {},
    },
  } as Release;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private catalogService: CatalogService,
    private gitReleaseService: GitReleaseService,
    private k8sReleaseService: K8sReleaseService,
    private rightSidebarService: RightSidebarService,
    private appConfigService: AppConfigService,
    private notificationService: NotificationService,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {
    this.userInfo = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.catalogItem.name = this.route.snapshot.paramMap.get('service') as string;
    this.catalogItem.catalogId = this.route.snapshot.queryParamMap.get('catalog') as string;
    this.catalogItem.icon = this.appConfigService.kadServicesInfo(this.catalogItem.name).icon as string;
    this.catalogItem.home = this.appConfigService.kadServicesInfo(this.catalogItem.name).home as string;

    this.submissionMode = this.appConfigService.getSubmissionMode();

    this.releaseForm = this.fb.group({
      metadata: this.fb.group({
        name: [
          this.releasePayload.metadata.name || this.uniqName(this.catalogItem.name),
          [Validators.required, Validators.pattern(KUBERNETES_OBJECT_PATTERN)],
        ],
        namespace: [
          this.releasePayload.metadata.namespace,
          [Validators.required, Validators.pattern(KUBERNETES_OBJECT_PATTERN)],
        ],
      }),
      spec: this.fb.group({
        package: this.fb.group({
          repository: [this.releasePayload.spec.package.repository, Validators.required],
          tag: [this.releasePayload.spec.package.tag, Validators.required],
        }),
        createNamespace: [this.releasePayload.spec.createNamespace],
        parameters: this.fb.array([]),
      }),
    });

    this.store.pipe(select(getClusterId)).subscribe(clusterId => {
      if (clusterId) {
        this.isLoaded = false;
        this.clusterId = clusterId;
        this.fetchPackage(this.catalogItem.catalogId, this.catalogItem.name);
      }
    });

    this.tag.valueChanges.subscribe(selectedVersion => {
      this.onVersionChange(selectedVersion);
    });
  }

  fetchPackage(catalogId: string, name: string): void {
    this.catalogService
      .getPackage(catalogId, name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: pkg => {
          this.repoUrl = pkg.repoUrl;
          this.availableTags = sortVersionsDesc(pkg.versions);
          let latestTag = getLatestVersion(this.availableTags) as string;
          this.updateForm(catalogId, name, latestTag);
          this.isLoaded = true;
        },
        error: error => {
          this.notificationService.onError(name, `Unable to fetch service, ${errorMessage(error)}`);
        },
      });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    // Build release payload
    this.releasePayload.metadata.name = this.name.value;
    this.releasePayload.spec.package.repository = this.repository.value;
    this.releasePayload.spec.package.tag = this.tag.value;
    let deflated = deflateParameters(this.parameters.value);
    this.releasePayload.spec.parameters = deflated;

    const namespace = this.releasePayload.metadata.namespace!;
    const name = this.releasePayload.metadata.name;

    const handlers = {
      git: () => this.gitReleaseService.post(this.clusterId, 'flux-system', 'releases-system', this.releasePayload),
      kubernetes: () => this.k8sReleaseService.post(this.clusterId, namespace, this.releasePayload, false),
    };

    handlers[this.submissionMode]()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (_: ServerResponse) => {
          this.notificationService.onSuccess(
            `${name}/${namespace}`,
            `was successfully submitted into ${this.submissionMode === 'git' ? 'Git' : 'Kubernetes'}.`
          );
          this.goBack();
        },
        error: error => {
          this.notificationService.onError(`${name}/${namespace}`, `was failed, ${errorMessage(error)}`);
          this.goBack();
        },
      });
  }

  goBack(): void {
    this.isSubmitting = false;
    this.router.navigate([`/catalogs/${this.catalogItem.catalogId}`]);
  }

  onVersionChange(version: string): void {
    this.updateForm(this.catalogItem.catalogId, this.catalogItem.name, version);
  }

  get isValid() {
    this.logInvalidControls(this.releaseForm);
    return this.releaseForm.valid;
  }

  toggleUserProfile(): void {
    this.rightSidebarService.toggle(RightSidebarToggle.USER_PROFILE);
  }

  get metadata(): FormGroup {
    return this.releaseForm.get('metadata') as FormGroup;
  }

  get name(): FormGroup {
    return this.metadata.get('name') as FormGroup;
  }

  get spec(): FormGroup {
    return this.releaseForm.get('spec') as FormGroup;
  }

  get package(): FormGroup {
    return this.spec.get('package') as FormGroup;
  }

  get repository(): FormGroup {
    return this.package.get('repository') as FormGroup;
  }

  get tag(): FormGroup {
    return this.package.get('tag') as FormGroup;
  }

  toFormGroupParameter(p: JsonSchemaProperty): FormGroup {
    const validators: ValidatorFn[] = [];

    if (p.isRequired) {
      validators.push(Validators.required);
    }

    if (p.pattern) {
      validators.push(Validators.pattern(new RegExp(p.pattern)));
    }

    return new FormGroup({
      name: new FormControl(p.name),
      value: new FormControl(p.defaultValue ?? null, validators),
    });
  }

  getParameters(): FormArray {
    return this.spec.get('parameters') as FormArray;
  }

  get parameters() {
    return this.getParameters();
  }

  getFormGroupAtIndex(index: number) {
    return this.parameters[index] as FormGroup;
  }

  add(event: any, formArray: FormArray): void {
    const input = event.input;
    const value = event.value;

    // Add role to FormArray
    if ((value || '').trim()) {
      formArray.push(this.fb.control(value.trim()), { emitEvent: false });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(role: string, formArray: FormArray): void {
    const index = formArray.value.indexOf(role);

    if (index >= 0) {
      formArray.removeAt(index);
    }
  }

  private async updateForm(catalogId: string, packageName: string, tag: string): Promise<void> {
    this.releaseForm.patchValue(
      {
        spec: {
          package: {
            repository: this.repoUrl + '/' + packageName,
            tag: tag,
          },
        },
      },
      { emitEvent: false }
    );

    try {
      const schema = await firstValueFrom(this.catalogService.getPackageSchema(catalogId, packageName, tag));
      const parameters = (schema as any).parameters;
      if (!parameters) {
        console.warn('Schema does not contain parameters');
        return;
      }

      this.parameterProperties = toJsonSchemaProperties(parameters);

      const formGroups = this.parameterProperties.map(p => this.toFormGroupParameter(p));

      this.parameters.clear();
      formGroups.forEach(fg => this.parameters.push(fg, { emitEvent: false }));
    } catch (error) {
      const message = error instanceof Error ? errorMessage(error) : 'Unknown error';
      this.notificationService.onError(
        'catalog',
        `Unable to fetch package ${packageName}:${tag} parameters from catalogId ${catalogId}, ${message}`
      );
    }

    this.cdr.detectChanges();
  }

  private uniqName(name: string): string {
    return name + '-' + Math.random().toString(36).substring(2, 8);
  }

  get isNameValid(): boolean {
    const control = this.metadata.get('name');
    return !(control?.invalid && (control.touched || control.dirty || !control.value));
  }

  logInvalidControls(formGroup: FormGroup | FormArray, path: string = '') {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const currentPath = path ? `${path}.${key}` : key;

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.logInvalidControls(control, currentPath);
      } else if (control && control.invalid) {
        console.warn(`Invalid control: ${currentPath}`, control.errors);
      }
    });
  }
}
