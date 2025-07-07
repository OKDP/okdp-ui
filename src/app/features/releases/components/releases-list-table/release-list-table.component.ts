import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EndpointsFromUsagePipe, TitleCasePipe } from '../../../../shared/pipes';
import { LoadingComponent } from '../../../../shared/components/loading';
import { KebabMenuComponent } from '../../../../shared/components/kebab-menu';
import { ReleaseInstance } from '../../../../model';
import { ContentToolbarComponent } from '../../../../shared/components/content-toolbar';
import { AbstractReleaseBaseComponent } from '../../shared';

@Component({
  selector: 'app-releases-list-card',
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
    KebabMenuComponent,
    ContentToolbarComponent,
    TitleCasePipe,
  ],
  providers: [EndpointsFromUsagePipe],
  templateUrl: './release-list-table.component.html',
  styleUrls: ['./release-list-table.component.scss'],
  animations: [],
})
export class ReleaseListTableComponent
  extends AbstractReleaseBaseComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['select', 'name', 'status', 'creationTimestamp', 'actions'];
  dataSource = new MatTableDataSource<ReleaseInstance>();
  selection = new SelectionModel<ReleaseInstance>(true, []);

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

  toggleDelete(release: ReleaseInstance) {
    this.selection.toggle(release);
    this.deletedItems = [...this.selection.selected];
  }

  override updateDataSource(instances: ReleaseInstance[]): void {
    this.dataSource.data = instances;
  }

  onDelete(row: any) {
    super.delete(row.name);
  }

  onEdit(row: any) {
    super.edit(row.name);
  }

  onFavorite(row: any) {}
}
