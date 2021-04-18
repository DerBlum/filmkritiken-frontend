import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Bewertung, Film, FilmbewertungDetails, Filmbewertungen, Filmdetails, ImageData } from '../types/DataTypes';
import * as data from '../../../assets/data/filmkritiken.json';

@Injectable({
  providedIn: 'root'
})
export class FilmkritikenDataResolver implements Resolve<Array<Filmbewertungen>> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Filmbewertungen>> {

    var jsonString = JSON.stringify((data as any).default);
    var parsedJson: Array<Filmbewertungen> = JSON.parse(jsonString, dateParser);

    return of(parsedJson);
  }

}

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const dateFormatDetailed = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

function dateParser(key, value) {
  if (typeof value === "string" && (dateFormat.test(value) || dateFormatDetailed.test(value))) {
    return new Date(value);
  }

  return value;
}
