import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import * as Highcharts from 'highcharts';
import { WindowService } from 'src/app/services/resize.service';
import { BaseHighchartsData } from '../../models/base-highcharts-data';
import { DataEntry } from '../../models/data';
import { ControlPanel, FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-time-plot',
  templateUrl: './time-plot.component.html',
})
export class TimePlotComponent implements OnInit {
  isHighcharts = typeof Highcharts === 'object';
  highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  should_update_chart = false;
  chartRef: Highcharts.Chart;

  controlPanel: ControlPanel;

  data: BaseHighchartsData | null;

  constructor(
    private readonly i18nService: TranslateService,
    private readonly filterService: FilterService
  ) {}

  ngOnInit() {
    this.i18nService.onLangChange.subscribe(({ lang }) =>
      this.updateChartText(lang)
    );

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
      },
      yAxis: {
        ...this.data.yAxisConfig,
        title: {
          ...this.data.yAxisConfig.title,
          style: {
            fontSize: '16',
          },
        },
      },
      ...this.data,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 600,
            },
            chartOptions: {
              legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal',
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
            ? this.controlPanel.variable?.nome_viz_serie
            : this.controlPanel.variable?.nome_viz_serie_en,
      },
      tooltip: {
        pointFormat:
          targetLang === 'pt'
            ? `{series.name}<br />Percentual: <b>{point.y} %</b><br />Número de Pessoas: <b>{point.value:,.0f} pessoas</b><br /> População do ano: <b>{point.total:,.0f} pessoas</b><br />`
            : `{series.name}<br />Percentage: <b>{point.y} %</b><br />Number of People: <b>{point.value:,.0f} people</b><br /> Population of the year: <b>{point.total:,.0f} people</b><br />`,
      },
    };
  }

  groupBy(): BaseHighchartsData | null {
    let data = this.filterService.getPlotData();

    if (!data || !data.length) return null;

    data = data.sort((a, b) => a.ano_entrada - b.ano_entrada);

    type RollupResult = { n: number };
    type YearsAccumulator = { [k: string]: number };
    type Value = { key: string; value: RollupResult };

    const nestedByYear = d3
      .nest<DataEntry, RollupResult>()
      .key((d) => String(d.nivel))
      .key((d) => String(d.ano_entrada))
      .rollup((v) => ({ n: d3.sum(v, (d) => d.n) }))
      .entries(data.filter((d) => !!d.ano_entrada));

    const totalByYear = nestedByYear.reduce((acc, currentCategory) => {
      (currentCategory.values as Value[]).forEach((val) => {
        if (!acc[val.key]) acc[val.key] = 0;
        acc[val.key] += val.value.n;
      });
      return acc;
    }, {} as YearsAccumulator);

    const result = nestedByYear.map((yearEntry) => {
      const associatedCategory = this.controlPanel.categories?.find(
        (c) => String(c.nivel) === String(yearEntry.key)
      );
      return {
        name: associatedCategory!.label,
        data: (yearEntry.values as Value[]).map((val) => ({
          x: +val.key,
          y: parseFloat(
            ((100 * val.value.n) / totalByYear[val.key]).toFixed(2)
          ),
          value: val.value.n,
          total: totalByYear[val.key],
        })),
      };
    });

    return {
      labels: result[0].data.map((d: any) => String(d.x)),
      series: result
        .sort((a, b) => a.name?.localeCompare(b.name) ?? 0)
        .map((r) => ({ ...r, type: 'line' })),
      yAxisConfig: {
        title: {
          text: 'Porcentagem',
        },
      },
    };
  }
}
