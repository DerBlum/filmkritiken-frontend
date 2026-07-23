import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { FkAccordionComponent } from './filmkritiken/components/fk-accordion/fk-accordion.component';
import { FilmkritikenDataResolver } from './filmkritiken/resolvers/filmkritiken-data.resolver';

const routes: Routes = [
  <Route>{
    path: "",
    component: FkAccordionComponent,
    resolve: {
      filmbewertungen: FilmkritikenDataResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
