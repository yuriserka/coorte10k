import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { TimePlotComponent } from './time-plot.component';

@NgModule({
  declarations: [TimePlotComponent],
  imports: [CommonModule, TranslateModule, HighchartsChartModule],
  exports: [TimePlotComponent],
})
export class TimePlotModule {}
