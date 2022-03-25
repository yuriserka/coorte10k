import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './nav-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NavBarComponent],
  imports: [CommonModule, RouterModule, FontAwesomeModule, TranslateModule],
  exports: [NavBarComponent],
})
export class NavbarModule {}
