import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, zip } from 'rxjs';
import { DictionaryEntry } from '../../models/dict';
import { LabelEntry } from '../../models/label';
import {
  ApiService,
  IBGELoc,
  IBGEUFResponse,
} from '../../services/api.service';
import { ControlPanel, FilterService } from '../../services/filter.service';

type UfsByRegion = { [region: string]: IBGELoc[] };

interface CheckboxFilter extends Omit<LabelEntry, 'variavel'> {
  checked: boolean;
}

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
})
export class ControlPanelComponent implements OnInit {
  variableCategories: string[];
  variables: DictionaryEntry[];
  filteredVariables: DictionaryEntry[];
  regions: IBGELoc[];
  ufs: IBGEUFResponse[];
  ufsByRegion: UfsByRegion;
  form: FormGroup;
  controlPanel: ControlPanel;
  ageCategories: CheckboxFilter[];
  genderCategories: CheckboxFilter[] = [
    { nivel: 1, checked: true, label: 'Masculino', label_en: 'Men' },
    { nivel: 2, checked: true, label: 'Feminino', label_en: 'Women' },
  ];

  constructor(
    private readonly filterService: FilterService,
    private readonly formBuilder: FormBuilder,
    private readonly apiService: ApiService,
    public readonly i18nService: TranslateService
  ) {
    this.form = this.formBuilder.group({
      category: [null],
      variable: [null],
      ufs: [null],
      ages: [null],
      genders: [this.genderCategories],
    });
  }

  ngOnInit() {
    this.apiService.getDictionary().subscribe((response) => {
      this.variableCategories = [
        ...new Set(
          response.result.reduce(
            (acc, curr) => [...acc, curr.organizacao],
            [] as string[]
          )
        ),
      ];
      this.variables = this.filteredVariables = response.result;
    });

    this.apiService
      .getLabelsForVariable('idade_entrada_cut')
      .subscribe((idadeFilterLabels) => {
        const sorted = idadeFilterLabels.result.sort(
          (a, b) => a.nivel - b.nivel
        );
        this.ageCategories = sorted.map((label) => ({
          ...label,
          checked: true,
        }));
        this.form.controls['ages'].setValue(this.ageCategories);
        this.filterService.update({
          ages: sorted.map((label) => label.nivel),
        });
      });

    this.apiService.getIBGEInfo().subscribe((response) => {
      this.regions = response
        .map((uf) => uf.regiao)
        .reduce(
          (acc, curr) =>
            !acc.some((region) => region.sigla === curr.sigla)
              ? [...acc, curr]
              : acc,
          [] as IBGELoc[]
        );

      this.ufsByRegion = response.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.regiao.sigla]: [...(acc[curr.regiao.sigla] ?? []), curr],
        }),
        {} as UfsByRegion
      );

      this.ufs = response;
    });

    this.filterService.controlPanel$.subscribe((cp) => {
      this.controlPanel = cp;
      if (!cp.variable) return;
    });

    this.listenToFormChanges();
  }

  updateUfs(type: string, { target }: any) {
    switch (type) {
      case 'uf':
        this.form.controls['ufs'].setValue([target.value]);
        break;
      case 'region':
        this.form.controls['ufs'].setValue(
          this.ufsByRegion[target.value].map((uf) => uf.sigla)
        );
        break;
      default:
        this.form.controls['ufs'].setValue(null);
    }
  }

  listenToFormChanges() {
    this.form.controls['ufs'].valueChanges.subscribe((ufs?: string[]) => {
      this.filterService.update({ ufs });
    });

    this.form.controls['variable'].valueChanges.subscribe(
      async (variable: DictionaryEntry) => {
        if (!variable) return;

        this.filterService.update({ variable, loading: true });
        zip(
          lastValueFrom(this.apiService.getDataForVariable(variable.variavel)),
          lastValueFrom(this.apiService.getLabelsForVariable(variable.variavel))
        ).subscribe(([data, labels]) => {
          this.filterService.update({
            data: data.result.map((d) =>
              d.idade_entrada_cut > 8 ? { ...d, idade_entrada_cut: 8 } : d
            ),
            categories: labels.result,
            loading: false,
          });
        });
      }
    );

    this.form.controls['category'].valueChanges.subscribe(
      (category: string) => {
        this.filteredVariables = this.variables.filter(
          (v) => v.organizacao === category
        );
        this.form.controls['variable'].setValue(null);
      }
    );
  }

  onCheckboxChange(modified: CheckboxFilter, target: 'ages' | 'genders') {
    const arr = this.form.controls[target].value as CheckboxFilter[];

    const newValues = arr.map((filter) =>
      filter.nivel === modified.nivel
        ? { ...filter, checked: !filter.checked }
        : filter
    );

    this.form.controls[target].setValue(newValues);

    this.filterService.update({
      [target]: newValues.filter((age) => age.checked).map((age) => age.nivel),
    });
  }
}
