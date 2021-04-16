import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Filmbewertungen, Film, Bewertung } from './../../types/DataTypes';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'fk-table',
  templateUrl: './fk-table.component.html',
  styleUrls: ['./fk-table.component.css'],
})
export class FkTableComponent implements OnInit {

  displayedColumns: string[] = ['person', 'wertung'];

  @Input()
  film: Film

  @Input()
  bewertungen: Array<Bewertung>

  bewertungenDataSource: MatTableDataSource<Bewertung>

  constructor() { }

  ngOnInit(): void {
    this.bewertungenDataSource = new MatTableDataSource(this.bewertungen);
  }

  getAverageWertung(): number {
    var counter = 0;
    var rating = 0;
    this.bewertungen.forEach(element => {
      rating = rating + element.wertung;
      counter = counter + 1;
    });

    return 9;
  }

}
