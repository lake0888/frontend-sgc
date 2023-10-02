import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { BreadcrumbComponent } from './components/layout/breadcrumb/breadcrumb.component';
import { SpecialtyComponent } from './components/article_module/specialty/specialty.component';
import { FamilyComponent } from './components/article_module/family/family.component';
import { SubfamilyComponent } from './components/article_module/subfamily/subfamily.component';
import { PaginationComponent } from './components/layout/table/pagination/pagination.component';
import { MessageComponent } from './components/layout/message/message.component';
import { FilterComponent } from './components/layout/table/filter/filter.component';
import { CountryComponent } from './components/util/country/country.component';
import { CountryStateComponent } from './components/util/country-state/country-state.component';
import { AddressComponent } from './components/util/address/address.component';
import { ContactDetailsComponent } from './components/util/contact-details/contact-details.component';
import { ImporterComponent } from './components/importer_module/importer/home/importer.component';
import { ImporterPageComponent } from './components/importer_module/importer/page/importer-page.component';
import { CarrierComponent } from './components/carrier_module/carrier/home/carrier.component';
import { CarrierPageComponent } from './components/carrier_module/carrier/page/carrier-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent, 
    SpecialtyComponent,
    FamilyComponent,
    SubfamilyComponent,
    PaginationComponent,
    MessageComponent,
    FilterComponent,
    CountryComponent,
    CountryStateComponent,
    AddressComponent,
    ContactDetailsComponent,
    ImporterComponent,
    ImporterPageComponent,
    CarrierComponent,
    CarrierPageComponent,  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
