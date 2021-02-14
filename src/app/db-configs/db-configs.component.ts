import { Component, OnInit } from '@angular/core';

import { DbConfig } from '../database/models/db-config';
import { DbConfigService } from '../database/services/db-config.service';

@Component({
  selector: 'db-configs',
  templateUrl: './db-configs.component.html',
  styleUrls: ['./db-configs.component.scss']
})
export class DbConfigsComponent implements OnInit {
  dbConfigs: DbConfig[] = [];

  constructor(private dbConfigService: DbConfigService) { }

  ngOnInit(): void {
    this.dbConfigService
      .get()
      .then(_ => {
        this.dbConfigs = _;
      } );
  }
}
