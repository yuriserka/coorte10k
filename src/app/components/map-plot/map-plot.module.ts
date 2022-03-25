import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { MapPlotComponent } from './map-plot.component';

@NgModule({
  declarations: [MapPlotComponent],
  imports: [CommonModule, TranslateModule, HighchartsChartModule],
  exports: [MapPlotComponent],
})
export class MapPlotModule {}
