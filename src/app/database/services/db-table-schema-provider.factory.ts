import { DbConfig, DbType } from '../models/db-config';

import { DbTableSchemaProvider } from './db-table-schema-provider';
import { Injectable } from '@angular/core';
import { SampleDbTableSchemaProvider } from './sample-db-table-schema-provider';

@Injectable()
export class DbTableSchemaProviderFactory {

  constructor(
    private sample: SampleDbTableSchemaProvider
  ) { }

  public GetProvider(config: DbConfig): DbTableSchemaProvider {
    switch(config.dbType) {
      case DbType.SAMPLE:
      default: 
        return this.sample;
    }
  } 
}
