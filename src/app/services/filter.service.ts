import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataEntry } from '../models/data';
import { DictionaryEntry } from '../models/dict';
import { LabelEntry } from '../models/label';

export type ControlPanel = {
  ufs?: string[];
  variable?: DictionaryEntry;
  data?: DataEntry[];
  categories?: LabelEntry[];
  ages?: number[];
  genders: number[];
  loading: boolean;
};

@Injectable({ providedIn: 'root' })
export class FilterService {
  private controlPanel = new BehaviorSubject<ControlPanel>({
    loading: false,
    genders: [1, 2],
  });

  controlPanel$ = this.controlPanel.asObservable();

  constructor() {}

  update(value: Partial<ControlPanel>) {
    const newVal = {
      ...this.controlPanel.value,
      ...value,
    };
    this.controlPanel.next(newVal);
    console.log('control panel changed to', { newVal });
  }

  getPlotData() {
    const { ufs, variable, data, categories, ages, genders } =
      this.controlPanel.value;

    if (!variable || !data || !categories) return null;

    let result = data
      .filter((d) => !ufs || ufs.includes(d.UF))
      .filter((d) => d.nivel < 20);

    if (ages?.length)
      result = result.filter((d) => ages.includes(d.idade_entrada_cut));

    if (genders?.length)
      result = result.filter((d) => genders.includes(d.cod_sexo_pessoa_eq));

    return result;
  }
}
