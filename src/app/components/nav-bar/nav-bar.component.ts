import { Component } from '@angular/core';
import {
  faHome,
  faChartLine,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent {
  menuOptions = [
    { icon: faHome, label: 'inicio', href: '/' },
    { icon: faChartLine, label: 'painel', href: '/app/dashboard' },
    { icon: faComment, label: 'opinião', href: '/app/opinion' },
  ];

  constructor(private readonly i18nService: TranslateService) {}

  updateLanguage(langCode: string) {
    if (this.i18nService.currentLang !== langCode) {
      this.i18nService.use(langCode);
    }
  }
}
