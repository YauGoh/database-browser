import { CommonModule } from '@angular/common';
import { DbConfigService } from './services/db-config.service';
import { DbTableSchemaProviderFactory } from './services/db-table-schema-provider.factory';
import { NgModule } from '@angular/core';
import { SampleDbTableSchemaProvider } from './services/sample-db-table-schema-provider';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    DbConfigService,
    DbTableSchemaProviderFactory,
    SampleDbTableSchemaProvider
  ]
})
export class DatabaseModule { }
