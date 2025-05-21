import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatButtonModule } from '@angular/material/button';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/auth';
import { errorMessage, UserInfo } from '../../../../core/models';
import { RightSidebarService, RightSidebarToggle } from '../../../../shared/services';
import {
  sortVersionsDesc,
  getLatestVersion,
  convertToJsonDotNotation,
  convertComponentReleaseToReleases,
  parametersArrayToObject,
} from '../../../../shared/utils';
import { ReleaseService } from '../../services/release.service';
import { AppState } from '../../../../core/store';
import { getClusterId } from '../../../../core/common/clusters';
import { Release, Package } from '../../../../api/_model';
import { CatalogItem } from '../../../catalogs/models/catalog-item.model';
import { AppConfigService } from '../../../../core/config';
import { LoadingComponent } from '../../../../shared/components/loading';
import { NotificationService } from '../../../../core/common/notifications';

@Component({
  selector: 'app-release-deploy',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
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
  release: CatalogItem = {
    name: 'Loading ...',
    icon: '',
    home: '',
  };
  clusterId: string = '';

  readonly userInfo: UserInfo;
  isLoaded = false;
  isSubmitting: boolean = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  componentReleaseForm!: FormGroup;

  packageVersions: { [version: string]: Package } = {};
  availableVersions: string[] = [];
  serviceFileName: string = '';

  schema = {
    gitRepoFolder: 'deployments',
    comment: 'Create new service instance',
    componentRelease: {
      component: {
        name: '',
        parameters: [{}],
        version: '',
      },
      name: '',
      namespace: '',
    },
    allowCreateNamespace: false,
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private componentService: ReleaseService,
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
    this.release.name = this.route.snapshot.paramMap.get('service') as string;
    this.release.catalogName = this.route.snapshot.queryParamMap.get('catalog') as string;
    this.release.icon = this.appConfigService.kadServicesInfo(this.release.name).icon as string;
    this.release.home = this.appConfigService.kadServicesInfo(this.release.name).home as string;

    this.componentReleaseForm = this.fb.group({
      comment: [this.schema.comment, Validators.required],
      gitRepoFolder: [this.schema.gitRepoFolder, Validators.required],
      componentRelease: this.fb.group({
        name: [this.schema.componentRelease.name, Validators.required],
        namespace: [this.schema.componentRelease.namespace, Validators.required],
        component: this.fb.group({
          name: [this.schema.componentRelease.component.name],
          version: [this.schema.componentRelease.component.version],
          parameters: this.fb.array([]),
        }),
      }),
    });

    this.store.pipe(select(getClusterId)).subscribe(clusterId => {
      if (clusterId) {
        this.isLoaded = false;
        this.clusterId = clusterId;
        this.fetchComponents(clusterId, this.release.name);
      }
    });

    this.name.valueChanges.subscribe(value => {
      this.updateServiceFileNameDescription(value);
    });

    this.version.valueChanges.subscribe(selectedVersion => {
      this.onVersionChange(selectedVersion);
    });
  }

  fetchComponents(clusterId: string, name: string): void {
    // this.componentService
    //   .get(clusterId, name)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: components => {
    //       if (components.length > 0) {
    //         components.forEach(c => {
    //           this.packageVersions[c.spec.version] = c;
    //         });

    //         this.availableVersions = sortVersionsDesc(Object.keys(this.packageVersions));
    //         let latestVersion = getLatestVersion(this.availableVersions) as string;
    //         this.updateForm(this.packageVersions[latestVersion]);
    //         this.isLoaded = true;
    //         this.cdr.detectChanges();
    //       }
    //     },
    //     error: error => {
    //       this.notificationService.onError(name, `Unable to fetch service, ${errorMessage(error)}`);
    //     },
    //   });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    // const formValue = parametersArrayToObject(this.componentReleaseForm.value);
    // const componentReleaseForm: ComponentReleaseRequest = convertComponentReleaseToReleases(formValue);

    // this.componentService
    //   .put(this.clusterId, formValue.componentRelease.name, componentReleaseForm)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: (_: ComponentReleaseRequest[]) => {
    //       this.notificationService.onSuccess(
    //         formValue.componentRelease.name + ' ',
    //         'was successfully submitted into Git via KAD.'
    //       );
    //       this.goBack();
    //     },
    //     error: error => {
    //       this.notificationService.onError(formValue.componentRelease.name, `was failed, ${errorMessage(error)}`);
    //       this.goBack();
    //     },
    //   });
  }

  goBack(): void {
    this.isSubmitting = false;
    this.router.navigate([`/catalogs/${this.release.catalogName}`]);
  }

  onVersionChange(version: string): void {
    this.updateForm(this.packageVersions[version]);
    // Trigger change detection to update the form
    this.cdr.detectChanges();
  }

  get isValid() {
    const form = this.componentReleaseForm;
    return form.get('comment')?.valid && form.get('gitRepoFolder')?.valid && form.get('componentRelease.name')?.valid;
  }

  toggleUserProfile(): void {
    this.rightSidebarService.toggle(RightSidebarToggle.USER_PROFILE);
  }

  get componentRelease(): FormGroup {
    return this.componentReleaseForm.get('componentRelease') as FormGroup;
  }

  get name(): FormGroup {
    return this.componentRelease.get('name') as FormGroup;
  }

  get component(): FormGroup {
    return this.componentRelease.get('component') as FormGroup;
  }

  get version(): FormGroup {
    return this.component.get('version') as FormGroup;
  }

  toFormGroupParameter(name: string, value: string): FormGroup {
    return this.fb.group({
      name: name,
      value: value,
    });
  }

  toggleParameter(index: number): void {
    const parameters = this.getParameters();

    if (index === parameters.length - 1) {
      // Add new parameter
      parameters.push(this.toFormGroupParameter('', ''), { emitEvent: false });
    } else {
      // Remove parameter at the specified index
      parameters.removeAt(index, { emitEvent: false });
    }
  }

  getParameters(): FormArray {
    const component = this.componentRelease.get('component') as FormGroup;
    return component.get('parameters') as FormArray;
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

  private updateForm(component: Package) {
    this.schema.componentRelease.component.name = component.name;
    //this.schema.componentRelease.component.version = component.version;
    //this.schema.allowCreateNamespace = component.spec.allowCreateNamespace;

    this.componentReleaseForm.patchValue(
      {
        componentRelease: {
          component: {
            name: this.schema.componentRelease.component.name,
            version: this.schema.componentRelease.component.version,
          },
        },
      },
      { emitEvent: false }
    );

    // Update parameters
    // const entries = Object.entries(convertToJsonDotNotation(component.spec.parameters));
    // if (entries.length > 0) {
    //   this.getParameters().clear();
    // }
    // entries
    //   .map(([name, value]) => this.toFormGroupParameter(name, value === null ? '' : value))
    //   .forEach(control => {
    //     this.getParameters().push(control, { emitEvent: false });
    //   });
  }

  updateServiceFileNameDescription(serviceName: string): void {
    if (serviceName) {
      this.serviceFileName = serviceName;
    } else {
      this.serviceFileName = '';
    }
  }
}
