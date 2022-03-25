import { Component } from '@angular/core';
import * as BrazilMap from '@highcharts/map-collection/countries/br/br-all.geo.json';
import { TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import * as Highcharts from 'highcharts/highmaps';
import { DataEntry } from '../../models/data';
import { ControlPanel, FilterService } from '../../services/filter.service';

import HC_exporting from 'highcharts/modules/exporting';
import { WindowService } from 'src/app/services/resize.service';
HC_exporting(Highcharts);

type MapDataEntry = {
  name_pt: string;
  name_en: string;
  values: {
    name: string;
    value: number;
    x: number;
    y: number;
  }[];
};

@Component({
  selector: 'app-map-plot',
  templateUrl: './map-plot.component.html',
})
export class MapPlotComponent {
  isHighcharts = typeof Highcharts === 'object';
  highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  chartConstructor = 'mapChart';

  controlPanel: ControlPanel;
  selectedCategoryIndex = 0;

  data: MapDataEntry[] | null;

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
      this.drawMap();
    });
  }

  drawMap() {
    if (!this.data) return;

    this.chartOptions = {
      chart: {
        map: BrazilMap,
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom',
          align: 'right',
        },
      },
      colorAxis: {
        min: 0,
        max: 100,
        minColor: '#FDFEE6',
        maxColor: '#021A4E',
        labels: {
          overflow: 'justify',
          formatter: function () {
            return `${this.value} %`;
          },
        },
      },
      legend: {
        layout: 'vertical',
        floating: true,
        verticalAlign: 'bottom',
        reversed: true,
        align: 'left',
        y: -25,
      },
      series: [
        {
          data: this.data[this.selectedCategoryIndex].values,
          keys: ['name', 'value', 'x', 'y'],
          joinBy: ['postal-code', 'name'],
          type: 'map',
          showInLegend: false,
          states: {
            hover: {
              color: '#139487',
            },
          },
          dataLabels: {
            enabled: false,
          },
        },
      ],
    };

    this.updateChartText(this.i18nService.currentLang);
  }

  updateChartText(targetLang: string) {
    const self = this;

    type MenuItemDefinition = { [k: string]: Highcharts.ExportingMenuObject };

    const sortedDataByLocale = this.data!.sort((a, b) => {
      const prop = targetLang === 'pt' ? 'name_pt' : 'name_en';
      return a[prop].localeCompare(b[prop]);
    });

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          ...(this.chartOptions.series?.[0] ?? { data: [], type: 'map' }),
          name: sortedDataByLocale[self.selectedCategoryIndex][
            targetLang === 'pt' ? 'name_pt' : 'name_en'
          ],
          data: sortedDataByLocale[self.selectedCategoryIndex].values as any,
        },
      ],
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
            ? `${self.controlPanel.variable?.nome_viz_mapa}: <b>${
                sortedDataByLocale[self.selectedCategoryIndex].name_pt
              }</b>`
            : `${self.controlPanel.variable?.nome_viz_mapa_en}: <b>${
                sortedDataByLocale[self.selectedCategoryIndex].name_en
              }</b>`,
      },
      tooltip: {
        pointFormat:
          targetLang === 'pt'
            ? `{point.name}<br />Percentual: <b>{point.value} %</b><br />Número de Pessoas: <b>{point.x:,.0f} pessoas</b><br /> População do ano: <b>{point.y:,.0f} pessoas</b><br />`
            : `{point.name}<br />Percentage: <b>{point.value} %</b><br />Number of People: <b>{point.x:,.0f} people</b><br /> Population of the year: <b>{point.y:,.0f} people</b><br />`,
      },
      exporting: {
        menuItemDefinitions: this.data?.reduce((acc, curr, i) => {
          return {
            ...acc,
            [targetLang === 'pt' ? curr.name_pt : curr.name_en]: {
              text: targetLang === 'pt' ? curr.name_pt : curr.name_en,
              onclick: function () {
                self.selectedCategoryIndex = i;
                this.setTitle({
                  text:
                    targetLang === 'pt'
                      ? `${self.controlPanel.variable?.nome_viz_mapa}: <b>${sortedDataByLocale[i].name_pt}</b>`
                      : `${self.controlPanel.variable?.nome_viz_mapa_en}: <b>${sortedDataByLocale[i].name_en}</b>`,
                });
                this.update({
                  exporting: {
                    buttons: {
                      contextButton: {
                        text:
                          targetLang === 'pt'
                            ? `Selecione uma categoria: ${sortedDataByLocale[i].name_pt}`
                            : `Select an category: ${sortedDataByLocale[i].name_en}`,
                      },
                    },
                  },
                  series: [
                    {
                      type: 'map',
                      name: sortedDataByLocale[i][
                        targetLang === 'pt' ? 'name_pt' : 'name_en'
                      ],
                    },
                  ],
                });

                this.series[0].setData(self.data![i].values);
              },
            },
          };
        }, {} as MenuItemDefinition),
        buttons: {
          contextButton: {
            align: 'left',
            verticalAlign: 'bottom',
            menuItems: this.data
              ?.map((d) => (targetLang === 'pt' ? d.name_pt : d.name_en))
              .sort((a, b) => a.localeCompare(b)),
            text:
              targetLang === 'pt'
                ? `<b>Selecione uma categoria:</b> ${
                    self.data?.[self.selectedCategoryIndex].name_pt
                  }`
                : `<b>Select an category:</b> ${
                    self.data?.[self.selectedCategoryIndex].name_en
                  }`,
          } as any,
        },
      },
    };
  }

  groupBy(): MapDataEntry[] | null {
    const data = this.filterService.getPlotData();

    if (!data || !data.length) return null;

    type RollupResult = { n: number };
    type UfsAccumulator = { [k: string]: number };
    type Value = { key: string; value: RollupResult };

    const nestedByUf = d3
      .nest<DataEntry, RollupResult>()
      .key((d) => String(d.nivel))
      .key((d) => String(d.UF))
      .rollup((v) => ({ n: d3.sum(v, (d) => d.n) }))
      .entries(data.filter((d) => d.UF?.length === 2));

    const totalByUf = nestedByUf.reduce((acc, currentCategory) => {
      (currentCategory.values as Value[]).forEach((val) => {
        if (!acc[val.key]) acc[val.key] = 0;
        acc[val.key] += val.value.n;
      });
      return acc;
    }, {} as UfsAccumulator);

    const result = nestedByUf.map((ufEntry) => {
      const associatedCategory = this.controlPanel.categories?.find(
        (c) => String(c.nivel) === String(ufEntry.key)
      );
      return {
        name_pt: associatedCategory!.label,
        name_en: associatedCategory!.label_en,
        data: (ufEntry.values as Value[]).map((val) => ({
          key: val.key,
          prop: parseFloat(
            ((100 * val.value.n) / totalByUf[val.key]).toFixed(2)
          ),
          n: val.value.n,
          total: totalByUf[val.key],
        })),
      };
    });

    return result.map(({ name_pt, name_en, data }) => ({
      name_pt,
      name_en,
      values: data.map((val) => ({
        name: val.key,
        value: val.prop,
        x: val.n,
        y: val.total,
      })),
    }));
  }
}
