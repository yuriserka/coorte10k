import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { VarSummaryModule } from '../var-summary/var-summary.module';
import { ControlPanelComponent } from './control-panel.component';

@NgModule({
  declarations: [ControlPanelComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    VarSummaryModule,
  ],
  exports: [ControlPanelComponent],
})
export class ControlPanelModule {}
