import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialtyComponent } from './components/article_module/specialty/specialty.component';
import { FamilyComponent } from './components/article_module/family/family.component';
import { SubfamilyComponent } from './components/article_module/subfamily/subfamily.component';
import { CountryComponent } from './components/util/country/country.component';
import { CountryStateComponent } from './components/util/country-state/country-state.component';
import { ImporterComponent } from './components/importer_module/importer/home/importer.component';
import { ImporterPageComponent } from './components/importer_module/importer/page/importer-page.component';
import { CarrierComponent } from './components/carrier_module/carrier/home/carrier.component';
import { CarrierPageComponent } from './components/carrier_module/carrier/page/carrier-page.component';
import { ProviderComponent } from './components/provider_module/home/provider/provider.component';
import { ProviderPageComponent } from './components/provider_module/page/provider-page/provider-page.component';


const routes: Routes = [
  { path: '', redirectTo: 'specialty', pathMatch: 'full' },
  { path: 'specialty', component: SpecialtyComponent, title: 'Home Specialty' },
  { path: 'family', component: FamilyComponent, title: 'Home Family'},
  { path: 'subfamily', component: SubfamilyComponent, title: 'Home Subfamily'},
  { path: 'country', component: CountryComponent, title: 'Home Country'},
  { path: 'countrystate', component: CountryStateComponent, title: 'Home Country State' },
  { path: 'importer', component: ImporterComponent, title: 'Home Importer' },
  { path: 'importer/add', component: ImporterPageComponent, title: 'Importer Page' },
  { path: 'importer/:id/edit', component: ImporterPageComponent, title: 'Importer Page' },
  { path: 'carrier', component: CarrierComponent, title: 'Home Carrier'},
  { path: 'carrier/add', component: CarrierPageComponent, title: 'Carrier Page' },
  { path: 'carrier/:id/edit', component: CarrierPageComponent, title: 'Carrier Page' },
  { path: 'provider', component: ProviderComponent, title: 'Home Provider' },
  { path: 'provider/add', component: ProviderPageComponent, title: 'Provider Page' },
  { path: 'provider/:id/edit', component: ProviderPageComponent, title: 'Provider Page' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
