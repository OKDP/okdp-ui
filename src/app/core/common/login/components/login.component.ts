import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { login, AuthService } from '../../../auth';
import { AppState } from '../../../store';

@Component({
  selector: 'app-users-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    // If the user already authenticated, skip the login page
    if (authService.isAuthenticated()) {
      this.login();
    }
  }

  login() {
    this.store.dispatch(login());
  }
}
