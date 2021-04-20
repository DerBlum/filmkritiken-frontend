import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { FilmkritikenService } from '../services/filmkritiken.service';
import { Filmbewertungen } from '../types/DataTypes';

@Injectable({
  providedIn: 'root'
})
export class FilmkritikenDataResolver implements Resolve<Array<Filmbewertungen>> {

  constructor(private filmkritikenService: FilmkritikenService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Filmbewertungen>> {
    return this.filmkritikenService.getFilmkritiken();
  }

}
