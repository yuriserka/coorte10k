import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ControlPanelModule } from 'src/app/components/control-panel/control-panel.module';
import { BarPlotModule } from '../../components/bar-plot/bar-plot.module';
import { MapPlotModule } from '../../components/map-plot/map-plot.module';
import { TimePlotModule } from '../../components/time-plot/time-plot.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TimePlotModule,
    ControlPanelModule,
    BarPlotModule,
    MapPlotModule,
    TranslateModule.forChild(),
  ],
  providers: [],
  bootstrap: [DashboardComponent],
})
export class DashboardModule {}
