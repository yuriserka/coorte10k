import { Component } from '@angular/core';
import { DownloadService } from '../../services/download.service';
import { saveAs } from 'file-saver';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  downloadIcon = faDownload;

  constructor(private readonly fileDownloaderService: DownloadService) {}

  download() {
    this.fileDownloaderService
      .download('/assets/app-dict.csv')
      .subscribe((blob) => saveAs(blob, 'dicionario_coorte_100M.csv'));
  }
}
