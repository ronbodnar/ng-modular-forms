import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeatureComponent } from './ui/feature.component';
import { CopyableTerminalText } from './ui/copyable-terminal-text.component';
import { MediaService } from '../core/media.service';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, FeatureComponent, CopyableTerminalText],
  templateUrl: './landing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private readonly mediaService = inject(MediaService);

  readonly isMobile = this.mediaService.isMobile;

  coreInstall = 'npm install @ng-modular-forms/core';
  materialInstall = 'npm install @ng-modular-forms/material';
}
