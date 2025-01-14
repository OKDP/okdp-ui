import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AppConfigService } from './app/core/config';

// NgRx effects uses APP_INITIALIZER and may load before the application configuration
// c.f. issue: https://github.com/ngrx/platform/issues/931
AppConfigService.loadConfig()
  .then(() => bootstrapApplication(AppComponent, appConfig))
  .catch(err => console.error(err));

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
