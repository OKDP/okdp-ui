import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  animations: [],
})
export class ErrorComponent {
  error: any;

  constructor() {}
}
