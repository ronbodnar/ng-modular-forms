import { JsonPipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormStatus } from '@ng-modular-forms/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { CodeBlockComponent } from '../code-block/code-block.component';
import { TechIconComponent } from '../../../icons/tech-icon.component';

@Component({
  selector: 'app-form-status-output',
  imports: [
    JsonPipe,
    MatTabsModule,
    MatIconModule,
    CodeBlockComponent,
    TechIconComponent,
  ],
  template: `
    <mat-tab-group class="border border-tertiary rounded-lg">
      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon class="pr-2">data_object</mat-icon>
          Form Output
        </ng-template>

        <div class="flex flex-col gap-2 p-3 bg-primary rounded-b-lg">
          @if (status()) {
            <p class="my-0 text-sm">
              Status: <span class="font-medium">{{ status() }}</span>
            </p>
          }

          @if (errorMessage()) {
            <p class="text-sm text-red-700">Error: {{ errorMessage() }}</p>
          }

          @if (output()) {
            <div class="text-sm">
              <span>Value:</span>
              <!-- assumes only one form output rendered per page -->
              <app-code-block
                id="form-output"
                [code]="output() | json"
                language="json"
              />
            </div>
          }
        </div>
      </mat-tab>

      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon class="pr-2">integration_instructions</mat-icon>
          Source Code
        </ng-template>

        @if (resolvedFiles().length === 1) {
          <app-code-block
            [id]="resolvedFiles()[0].path"
            [code]="resolvedFiles()[0].code"
            [language]="resolvedFiles()[0].language"
            [classList]="'max-h-120'"
          />
        } @else if (resolvedFiles().length > 1) {
          <mat-tab-group class="bg-primary">
            @for (file of resolvedFiles(); track file.path) {
              <mat-tab>
                <ng-template mat-tab-label>
                  <app-tech-icon
                    class="w-5 h-5 mr-2 rounded"
                    [name]="file.language"
                    [label]="file.label"
                  />
                  {{ file.label }}
                </ng-template>
                <app-code-block
                  [id]="file.path"
                  [code]="file.code"
                  [language]="file.language"
                  [classList]="'max-h-120 rounded-b-lg'"
                />
              </mat-tab>
            }
          </mat-tab-group>
        }
      </mat-tab>
    </mat-tab-group>
  `,
})
export class FormStatusOutputComponent {
  private http = inject(HttpClient);

  status = input<FormStatus | null>(null);
  errorMessage = input<string | null>(null);
  output = input<{ [key: string]: any } | null>(null);

  files = input<{ language: string; path: string }[]>([]);

  resolvedFiles = signal<
    { path: string; language: string; code: string; label: string }[]
  >([]);

  constructor() {
    effect(() => {
      const files = this.files();

      if (!files?.length) {
        this.resolvedFiles.set([]);
        return;
      }

      forkJoin(
        files.map((f) => this.http.get(f.path, { responseType: 'text' })),
      ).subscribe((codes) => {
        this.resolvedFiles.set(
          files.map((f, i) => ({
            ...f,
            label: f.path.split('/').pop() ?? f.path,
            code: codes[i],
          })),
        );
      });
    });
  }
}
