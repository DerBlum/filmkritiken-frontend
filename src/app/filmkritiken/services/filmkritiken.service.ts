import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { Filmbewertungen } from '../types/DataTypes';
//import * as data from '../../../assets/Filmkritiken.json'

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const dateFormatDetailed = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class FilmkritikenService {

  constructor() { }

  getFilmkritiken(): Observable<Array<Filmbewertungen>> {

    //console.log(data)
    //let json = data as any;
    //console.log(json.default)
    //let jsonString = JSON.stringify(json.default);
    //console.log(jsonString)
    //return of(JSON.parse(jsonString, dateParser));

    let url = 'https://raw.githubusercontent.com/DerBlum/filmkritiken/master/Filmkritiken.json';
    return from(
      fetch(url)
        .then(res => res.text()))
      .pipe(
        map(response => JSON.parse(response, dateParser)),
        catchError(err => of(new Array()))
      );

  }

}

function dateParser(key: any, value: any) {
  if (typeof value === "string" && (dateFormat.test(value) || dateFormatDetailed.test(value))) {
    return new Date(value);
  }

  return value;
}
