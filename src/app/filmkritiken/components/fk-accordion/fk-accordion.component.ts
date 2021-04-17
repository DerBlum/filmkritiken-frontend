import { Component, OnInit, ViewChild } from '@angular/core';
import { Filmbewertungen, Film, Bewertung, ImageData, FilmbewertungDetails, Filmdetails } from '../../types/DataTypes';

@Component({
  selector: 'fk-accordion',
  templateUrl: './fk-accordion.component.html',
  styleUrls: ['./fk-accordion.component.css']
})
export class FkAccordionComponent implements OnInit {

  items: Array<Filmbewertungen>;

  constructor() { }

  ngOnInit(): void {
    this.items = [
      <Filmbewertungen>{
        filmbewertungDetails: <FilmbewertungDetails>{
          beitragvon: "Dani",
          besprochenam: new Date(2021, 4 - 1, 4)
        },
        film: <Film>{
          titel: "Enter The Void",
          image: <ImageData>{
            source: "EnterTheVoid.jpg",
            copyright: "IMDb"
          },
          details: <Filmdetails>{
            altersfreigabe: 18,
            erscheinungsjahr: new Date(2009, 1),
            regie: "Gaspar Noé",
            laenge: 161,
            originaltitel: "Enter the Void",
            originalsprache: "Englisch, Japanisch",
            produktionsland: "Frankreich, Japan, Kanada"
          }
        },
        bewertungen: [
          {
            von: "Dani",
            wertung: 7
          },
          {
            von: "Flo",
            wertung: 4
          },
          {
            von: "Nico",
            wertung: 2
          },
          {
            von: "Stefan",
            wertung: 1
          },
          {
            von: "Tiffy",
            wertung: 1
          }
        ] as Array<Bewertung>
      },
      <Filmbewertungen>{
        filmbewertungDetails: <FilmbewertungDetails>{
          beitragvon: "Flo",
          besprochenam: new Date(2021, 3 - 1, 28)
        },
        film: <Film>{
          titel: "Chihiros Reise ins Zauberland",
          image: <ImageData>{
            source: "chihiro.jpg",
            copyright: "dummy copyright"
          },
          details: <Filmdetails>{
            altersfreigabe: 0,
            erscheinungsjahr: new Date(2001, 1),
            regie: "Hayao Miyazaki",
            laenge: 125,
            originaltitel: "千と千尋の神隠し (Sen to Chihiro no Kamikakushi)",
            originalsprache: "Japanisch",
            produktionsland: "Japan"
          }
        },
        bewertungen: [
          {
            von: "Dani",
            wertung: 6
          },
          {
            von: "Flo",
            wertung: 9
          },
          {
            von: "Nico",
            wertung: 7
          },
          {
            von: "Stefan",
            wertung: 9
          },
          {
            von: "Tiffy",
            wertung: 9
          }
        ] as Array<Bewertung>
      },
      <Filmbewertungen>{
        filmbewertungDetails: <FilmbewertungDetails>{
          beitragvon: "Flo",
          besprochenam: new Date(2021, 3 - 1, 21)
        },
        film: <Film>{
          titel: "Chihiros Reise ins Zauberland",
          image: <ImageData>{
            source: "chihiro.jpg",
            copyright: "dummy copyright"
          },
          details: <Filmdetails>{
            altersfreigabe: 0,
            erscheinungsjahr: new Date(2001),
            regie: "Hayao Miyazaki",
            laenge: 125,
            originaltitel: "千と千尋の神隠し (Sen to Chihiro no Kamikakushi)",
            originalsprache: "Japanisch",
            produktionsland: "Japan"
          }
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
        filmbewertungDetails: <FilmbewertungDetails>{
          beitragvon: "Flo",
          besprochenam: new Date(2021, 3 - 1, 21)
        },
        film: <Film>{
          titel: "Chihiros Reise ins Zauberland",
          image: <ImageData>{
            source: "chihiro.jpg",
            copyright: "dummy copyright"
          },
          details: <Filmdetails>{
            altersfreigabe: 0,
            erscheinungsjahr: new Date(2001),
            regie: "Hayao Miyazaki",
            laenge: 125,
            originaltitel: "千と千尋の神隠し (Sen to Chihiro no Kamikakushi)",
            originalsprache: "Japanisch",
            produktionsland: "Japan"
          }
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
      }
    ];
  }

}
