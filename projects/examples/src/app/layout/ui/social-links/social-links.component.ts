import { Component } from '@angular/core';
import { TechIconComponent } from '../../../icons/tech-icon.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-social-links',
  imports: [TechIconComponent, MatButtonModule],
  templateUrl: './social-links.component.html',
})
export class SocialLinksComponent {}
