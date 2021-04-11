import { Component, OnInit, ViewChild } from '@angular/core';
import { Filmbewertungen, Film, Bewertung } from './../../types/DataTypes';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'fk-table',
  templateUrl: './fk-table.component.html',
  styleUrls: ['./fk-table.component.css']
})
export class FkTableComponent implements OnInit {

  displayedColumns: string[] = ['film', 'vorschlagvon'];
  filmbewertungen: MatTableDataSource<Filmbewertungen>

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.filmbewertungen = new MatTableDataSource([
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
      }] as Array<Filmbewertungen>);
  }

  ngAfterViewInit() {
    this.filmbewertungen.paginator = this.paginator;
  }

}
