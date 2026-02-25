import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Filmkritiken } from 'src/app/openapi';
import { FilmkritikenFrontendService } from '../services/filmkritiken.service';

@Injectable({
  providedIn: 'root'
})
export class FilmkritikenDataResolver  {

  constructor(private filmkritikenService: FilmkritikenFrontendService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Filmkritiken[]> {
    return this.filmkritikenService.getFilmkritiken();
  }

}
