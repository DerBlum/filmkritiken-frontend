import { Component, OnInit, ViewChild } from '@angular/core';
import { Filmbewertungen, Film, Bewertung } from '../../types/DataTypes';

@Component({
  selector: 'fk-accordion',
  templateUrl: './fk-accordion.component.html',
  styleUrls: ['./fk-accordion.component.css']
})
export class FkAccordionComponent implements OnInit {

  items: Array<Filmbewertungen>

  constructor() { }

  ngOnInit(): void {
    this.items = [
      <Filmbewertungen>{
        film: <Film>{
          name: "Chihiros Reise ins Zauberland",
          beitragvon: "Flo",
          besprochenam: new Date(2021, 3 - 1, 28)
        },
        bewertungen: [
          {
            von: "Flo",
            wertung: 9
          },
          {
            von: "Stefan",
            wertung: 9
          }
        ] as Array<Bewertung>
      },
      <Filmbewertungen>{
        film: <Film>{
          name: "Chihiros Reise ins Zauberland",
          beitragvon: "Flo",
          besprochenam: new Date(2021, 3 - 1, 21)
        },
        bewertungen: [
          {
            von: "Flo",
            wertung: 9
          },
          {
            von: "Stefan",
            wertung: 9
          }
        ] as Array<Bewertung>
      },
      <Filmbewertungen>{
        film: <Film>{
          name: "Chihiros Reise ins Zauberland",
          beitragvon: "Flo",
          besprochenam: new Date(2021, 3 - 1, 14)
        },
        bewertungen: [
          {
            von: "Flo",
            wertung: 9
          },
          {
            von: "Stefan",
            wertung: 9
          }
        ] as Array<Bewertung>
      }] as Array<Filmbewertungen>;
  }

}
