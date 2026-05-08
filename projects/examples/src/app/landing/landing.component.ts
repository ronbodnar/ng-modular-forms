import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeatureComponent } from './feature.component';
import { CopyableTerminalText } from './terminal.component';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, FeatureComponent, CopyableTerminalText],
  templateUrl: './landing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  coreInstall = 'npm install @ng-modular-forms/core';
  materialInstall = 'npm install @ng-modular-forms/material';
}
