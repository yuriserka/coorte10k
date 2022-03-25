import { BaseHighchartsData } from '../../models/base-highcharts-data';

export interface GarbageDump extends BaseHighchartsData {}

export const FakeGarbageDumpData: GarbageDump = {
  labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
  series: [
    {
      type: 'line',
      name: 'collected',
      data: [12, 16, 18, 27, 35, 48],
    },
    {
      type: 'line',
      name: 'burned',
      data: [40, 32, 20, 17, 14, 11],
    },
    {
      type: 'line',
      name: 'recycled',
      data: [4, 6, 6.7, 7.2, 7.9, 10],
    },
  ],
  yAxisConfig: {
    title: {
      text: 'Tons',
    },
  },
  tooltip: {
    formatter: function () {
      return `${this.y} TONS`;
    },
  },
};
