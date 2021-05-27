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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalModule, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { BrowserCacheLocation, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { ApiInterceptor } from './shared/interceptor/api.interceptor';
import { UserService } from './shared/user/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1; // Remove this line to use Angular Universal

export function loggerCallback(logLevel: LogLevel, message: string, containsPii: boolean) {
  if (containsPii) {
    return;
  }
  switch (logLevel) {
    case LogLevel.Error:
      console.error(message);
      return;
    case LogLevel.Info:
      console.info(message);
      return;
    case LogLevel.Verbose:
      console.debug(message);
      return;
    case LogLevel.Warning:
      console.warn(message);
      return;
  }
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: 'b4dcd77f-8bc3-46e4-add1-8a44cd968428',
      authority: 'https://login.microsoftonline.com/865638a4-e4fb-4aef-89e1-6824acc3a785',
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11. Remove this line to use Angular Universal
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

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
    MsalModule,
    MatButtonModule,
    MatIconModule,
    EcoFabSpeedDialModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  providers: [
    {
      provide: UserService,
      useClass: UserService
    },
    {
      provide: BASE_PATH,
      useValue: environment.BACKEND_URL,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    MsalService,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
