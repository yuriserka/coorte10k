import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VarSummaryComponent } from './var-summary.component';

@NgModule({
  declarations: [VarSummaryComponent],
  imports: [CommonModule, TranslateModule],
  exports: [VarSummaryComponent],
})
export class VarSummaryModule {}
