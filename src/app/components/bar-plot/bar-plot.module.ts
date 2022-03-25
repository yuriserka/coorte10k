import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { BarPlotComponent } from './bar-plot.component';

@NgModule({
  declarations: [BarPlotComponent],
  imports: [CommonModule, TranslateModule, HighchartsChartModule],
  exports: [BarPlotComponent],
})
export class BarPlotModule {}
