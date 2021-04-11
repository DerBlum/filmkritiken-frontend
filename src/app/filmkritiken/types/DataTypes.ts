export interface Film {
  name: string;
  beitragvon: string;
  besprochenam: Date;
};

export interface Bewertung {
  von: string;
  wertung: number;
};

export interface Filmbewertungen {
  film: Film;
  bewertungen: Array<Bewertung>;
};
