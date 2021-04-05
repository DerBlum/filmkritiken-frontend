export interface Film {
  name: string;
  vorschlagvon: string;
};

export interface Bewertung {
  von: string;
  wertung: number;
};

export interface Filmbewertungen {
  film: Film;
  bewertungen: Array<Bewertung>;
};
