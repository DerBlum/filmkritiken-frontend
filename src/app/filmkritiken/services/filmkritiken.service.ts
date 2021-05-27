import { Injectable } from '@angular/core';
import { catchError, map, mapTo } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BewertungenService, Filmkritiken, FilmkritikenService, FilmeService, SetBewertungRequest, FilmRequest } from 'src/app/openapi';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class FilmkritikenFrontendService {

  constructor(
    private filmkritikenService: FilmkritikenService,
    private filmeService: FilmeService,
    private bewertungenService: BewertungenService,
  ) { }

  getFilmkritiken(): Observable<Filmkritiken[]> {
    return this.filmkritikenService.apiFilmkritikenGet(50)
      .pipe(
        map(response => response),
        catchError(err => {
          console.error(err);
          return of(new Array());
        })
      );
  }

  addFilm(filmRequest: FilmRequest): Observable<Filmkritiken | Error> {
    return this.filmeService.apiFilmePut(filmRequest)
      .pipe(
        map(response => response),
        catchError(err => {
          console.error(err);
          return of(err);
        })
      )
  }

  setBewertung(filmkritikenId: string, username: string, setBewertungRequest: SetBewertungRequest): Observable<Error> {
    return this.bewertungenService.apiFilmkritikenFilmkritikenIdBewertungenUsernamePut(filmkritikenId, username, setBewertungRequest)
      .pipe(
        mapTo(undefined),
        catchError(err => {
          console.error(err);
          return of(err);
        })
      );
  }
}
