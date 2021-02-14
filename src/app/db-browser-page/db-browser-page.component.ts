import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DbConfig } from '../database/models/db-config';
import { DbConfigService } from '../database/services/db-config.service';
import { DbTableSchemaProviderFactory } from '../database/services/db-table-schema-provider.factory';
import { NotifyService } from '../notify.service';

@Component({
  selector: 'app-db-browser-page',
  templateUrl: './db-browser-page.component.html',
  styleUrls: ['./db-browser-page.component.scss']
})
export class DbBrowserPageComponent implements OnInit {
  
  dbConfig: DbConfig | undefined = undefined;
  showParameterError: boolean = false;
  showMissingConfig: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private dbConfigService: DbConfigService,
    private dbSchemaProviderFactory: DbTableSchemaProviderFactory,
    private notify: NotifyService) { }

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get("name");

    if (!name) { 
      this.notify.error("Please provide a valid database config to open.");
      return;
    }

    this.dbConfigService
      .getByName(name)
      .then(dbConfig => {
        if (!dbConfig) this.notify.error(`Unable to locate config '${name}'.`);

        this.dbConfig = dbConfig;
      } );
  }

}
