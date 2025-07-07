import {
  Component,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { selectProject } from '../../../../core/common/projects';
import { Project } from '../../../../api/_model';
import { ToStatusView } from '../../../../model';
import { LoadingComponent } from '../../../../shared/components/loading';
import { ContentToolbarComponent } from '../../../../shared/components/content-toolbar';
import { AbstractProjectBaseComponent } from '../../shared';
import { DialogComponent } from '../../../../shared/components/dialog';

@Component({
  selector: 'app-project-list-table',
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
    ContentToolbarComponent,
    DialogComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './project-list-table.component.html',
  styleUrls: ['./project-list-table.component.scss'],
})
export class ProjectListTableComponent
  extends AbstractProjectBaseComponent
  implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'select',
    'name',
    'displayName',
    'environment',
    'creationTimestamp',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<Project>();
  selection = new SelectionModel<Project>(true, []);

  hoveredRow: any = null;

  deletedItems: any[] = [];

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    super.onInit();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.paginatorIntl.itemsPerPageLabel = 'Show:';

    if (this.sort) {
      this.sort.active = 'name';
      this.sort.direction = 'asc';
      this.sort.sortChange.emit();
    }

    this.cdr.detectChanges();
  }

  ngAfterViewChecked(): void {
    if (this.dataSource.paginator !== this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.dataSource.sort !== this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleDeleteAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    this.deletedItems = [...this.selection.selected];
  }

  toggleDelete(project: Project) {
    this.selection.toggle(project);
    this.deletedItems = [...this.selection.selected];
  }

  onEdit(row: any) {
    super.edit(row.name);
  }

  onDelete(row: any) {
    super.onDeleteProject(row.name);
  }

  onSwitch(row: any) {
    super.switch(row.name);
  }

  onFavorite(row: any) {}

  override updateDataSource(projects: Project[]): void {
    this.dataSource.data = projects.map(project => {
      const [statusLabel, statusIcon] = ToStatusView(project.status);
      return { ...project, statusLabel, statusIcon };
    });

    this.store.dispatch(selectProject({ projectName: this.currentProjectName }));
  }
}
