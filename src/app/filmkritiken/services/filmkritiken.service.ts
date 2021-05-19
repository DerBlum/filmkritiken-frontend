import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Filmkritiken, FilmkritikenService } from 'src/app/openapi';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class FilmkritikenFrontendService {

  constructor(private filmkritikenService: FilmkritikenService) { }

  getFilmkritiken(): Observable<Filmkritiken[]> {
    return this.filmkritikenService.apiFilmkritikenGet()
      .pipe(
        map(response => response),
        catchError(err => of(new Array()))
      );

  }
}
