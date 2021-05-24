export * from './bewertungen.service';
import { BewertungenService } from './bewertungen.service';
export * from './filme.service';
import { FilmeService } from './filme.service';
export * from './filmkritiken.service';
import { FilmkritikenService } from './filmkritiken.service';
export const APIS = [BewertungenService, FilmeService, FilmkritikenService];
