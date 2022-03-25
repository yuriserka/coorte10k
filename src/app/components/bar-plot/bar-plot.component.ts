import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import * as Highcharts from 'highcharts';
import { WindowService } from 'src/app/services/window.service';
import { BaseHighchartsData } from '../../models/base-highcharts-data';
import { DataEntry } from '../../models/data';
import { ControlPanel, FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-bar-plot',
  templateUrl: './bar-plot.component.html',
})
export class BarPlotComponent implements OnInit {
  isHighcharts = typeof Highcharts === 'object';
  highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  should_update_chart = false;
  chartRef: Highcharts.Chart;

  controlPanel: ControlPanel;
  width: number;

  data: BaseHighchartsData | null;

  constructor(
    private readonly i18nService: TranslateService,
    private readonly filterService: FilterService,
    private readonly windowService: WindowService
  ) {}

  ngOnInit() {
    this.i18nService.onLangChange.subscribe(({ lang }) =>
      this.updateChartText(lang)
    );

    this.windowService.width$.subscribe((value) => {
      this.width = value;
    });

    this.filterService.controlPanel$.subscribe((cp) => {
      if (!cp.variable) return;
      this.controlPanel = cp;
      this.data = this.groupBy();
      this.drawGraph();
    });
  }

  drawGraph() {
    if (!this.data) return;

    this.chartOptions = {
      ...this.data,
      chart: {
        type: 'bar',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: false,
          },
          colorByPoint: true,
        },
      },
      credits: {
        href: 'https://cidacs.bahia.fiocruz.br/en/categorias-de-nucleo/bolsafamilia/',
      },
      legend: {
        align: 'left',
        verticalAlign: 'middle',
        layout: 'vertical',
      },
      title: {
        align: 'center',
      },
      xAxis: {
        categories: this.data.labels,
        ...this.data.xAxisConfig,
        title: {
          text: null,
        },
      },
      yAxis: {
        ...this.data.yAxisConfig,
        min: 0,
        max: 100,
        title: {
          ...this.data.yAxisConfig.title,
          style: {
            fontSize: '16',
          },
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 600,
            },
            chartOptions: {
              // trying to set chart width to 90% of screen
              // chart: {
              //   width: 0.9 * this.width,
              // },
              legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal',
              },
              yAxis: {
                title: {
                  text: '',
                },
              },
            },
          },
        ],
      },
    };

    this.updateChartText(this.i18nService.currentLang);
  }

  updateChartText(targetLang: string) {
    this.chartOptions = {
      ...this.chartOptions,
      credits: {
        ...this.chartOptions.credits,
        text:
          targetLang === 'pt'
            ? 'Dados disponíveis pelo CIDACS'
            : 'Data from CIDACS',
      },
      title: {
        ...this.chartOptions.title,
        text:
          targetLang === 'pt'
            ? this.controlPanel.variable?.nome_viz_barras
            : this.controlPanel.variable?.nome_viz_barras_en,
      },
      tooltip: {
        pointFormat:
          targetLang === 'pt'
            ? `Percentual: <b>{point.y} %</b><br />Número de Pessoas: <b>{point.value:,.0f} pessoas</b>`
            : `Percentage: <b>{point.y} %</b><br />Number of People: <b>{point.value:,.0f} persons</b>`,
      },
    };
  }

  groupBy(): BaseHighchartsData | null {
    const data = this.filterService.getPlotData();

    if (!data || !data.length) return null;

    type RollupResult = { n: number };

    const nestedByNivel = d3
      .nest<DataEntry, RollupResult>()
      .key((d) => String(d.nivel))
      .rollup((v) => ({ n: d3.sum(v, (d) => d.n) }))
      .entries(data.filter((d) => !!d.ano_entrada))
      .sort((a, b) => a.key.localeCompare(b.key));

    const total = d3.sum(nestedByNivel, (d) => d.value?.n);

    const result = nestedByNivel.map((nivelEntry) => {
      const associatedCategory = this.controlPanel.categories?.find(
        (c) => String(c.nivel) === String(nivelEntry.key)
      );
      return {
        name_pt: associatedCategory!.label,
        name_en: associatedCategory!.label_en,
        value: nivelEntry.value?.n,
        y: parseFloat(((100 * nivelEntry.value!.n) / total).toFixed(2)),
      };
    });

    return {
      labels: [],
      series: [
        {
          type: 'bar',
          keys: ['name', 'value', 'y'],
          showInLegend: false,
          data: result.sort((a, b) => a.name_pt?.localeCompare(b.name_pt) ?? 0),
        },
      ],
      yAxisConfig: {
        title: {
          text: 'Porcentagem',
        },
        labels: {
          overflow: 'justify',
          formatter: function () {
            return `${this.value} %`;
          },
        },
      },
      xAxisConfig: {
        categories: result.map((val) => val.name_pt),
        title: {
          text: null,
        },
      },
    };
  }
}
