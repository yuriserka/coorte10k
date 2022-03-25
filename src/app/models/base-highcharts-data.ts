import {
  SeriesOptionsType,
  TooltipOptions,
  XAxisOptions,
  YAxisOptions,
} from 'highcharts';

export interface BaseHighchartsData {
  labels: string[];
  series: SeriesOptionsType[];
  tooltip?: TooltipOptions;
  yAxisConfig: YAxisOptions;
  xAxisConfig?: XAxisOptions;
}
