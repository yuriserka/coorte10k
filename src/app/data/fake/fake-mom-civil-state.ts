import { BaseHighchartsData } from '../../models/base-highcharts-data';

export interface MomsCivilState extends BaseHighchartsData {}

export const FakeMomsCivilStateData: MomsCivilState = {
  labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
  series: [
    {
      type: 'pie',
      name: 'percentage',
      colorByPoint: true,
      data: [
        {
          name: 'married',
          y: 61.41,
        },
        {
          name: 'divorced',
          y: 11.84,
        },
        {
          name: 'single',
          y: 10.85,
        },
        {
          name: 'widow',
          y: 15.9,
        },
      ],
    },
  ],
  yAxisConfig: {
    title: {
      text: '',
    },
  },
  tooltip: {
    formatter: function () {
      return `${this.y}%`;
    },
  },
};
