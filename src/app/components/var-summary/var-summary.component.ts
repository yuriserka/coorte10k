import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DictionaryEntry } from 'src/app/models/dict';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-var-summary',
  templateUrl: './var-summary.component.html',
})
export class VarSummaryComponent implements OnInit {
  selectedVariable: DictionaryEntry;

  constructor(
    private readonly filterService: FilterService,
    public readonly i18nService: TranslateService
  ) {}

  ngOnInit() {
    this.filterService.controlPanel$.subscribe((cp) => {
      if (!cp.variable) return;
      this.selectedVariable = cp.variable;
    });
  }

  formatValidDataInfo() {
    const { n_validas, n_total } = this.selectedVariable;
    const perc = (100 * (n_validas / n_total)).toFixed(2);
    return `${n_validas} / ${n_total} (${perc}%)`;
  }
}
