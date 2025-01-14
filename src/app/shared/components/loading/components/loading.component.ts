import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [],
})
export class LoadingComponent {
  error: any;

  constructor() {}
}
