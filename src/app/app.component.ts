import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(iconRegistry: MatIconRegistry) {
    //https://www.npmjs.com/package/material-symbols
    //material-symbols-rounded, material-symbols-sharp
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
