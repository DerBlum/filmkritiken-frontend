import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FkContentComponent } from './filmkritiken/components/fk-content/fk-content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { FkAccordionComponent } from './filmkritiken/components/fk-accordion/fk-accordion.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FkTableComponent } from './filmkritiken/components/fk-table/fk-table.component';
import { FkImageComponent } from './filmkritiken/components/fk-image/fk-image.component';
import { FkFilminfoComponent } from './filmkritiken/components/fk-filminfo/fk-filminfo.component';
import { ApiModule, BASE_PATH } from './openapi';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    FkContentComponent,
    FkAccordionComponent,
    FkTableComponent,
    FkImageComponent,
    FkFilminfoComponent,
  ],
  imports: [
    ApiModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatExpansionModule,
    MatGridListModule,
    MatCardModule,
    FlexLayoutModule,
  ],
  providers: [
    [
      { provide: BASE_PATH, useValue: environment.BACKEND_URL }
    ]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
