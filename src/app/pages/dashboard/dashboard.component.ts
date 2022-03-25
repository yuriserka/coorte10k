import { Component, OnInit } from '@angular/core';
import { ControlPanel, FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  controlPanel: ControlPanel;

  constructor(private readonly filterService: FilterService) {}

  ngOnInit() {
    this.filterService.controlPanel$.subscribe(async (cp) => {
      this.controlPanel = cp;
    });
  }
}
