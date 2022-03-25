import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private readonly i18nService: TranslateService) {}

  ngOnInit(): void {
    this.i18nService.addLangs(['en', 'pt']);
    this.i18nService.setDefaultLang('pt');
    const browserLang = this.i18nService.getBrowserLang() ?? 'pt';
    this.i18nService.use(browserLang.match(/en|pt/) ? browserLang : 'pt');
  }
}
