import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Bewertung } from '../../types/DataTypes';

@Component({
  selector: 'fk-table',
  templateUrl: './fk-table.component.html',
  styleUrls: ['./fk-table.component.css']
})
export class FkTableComponent implements OnInit {

  @Input()
  bewertungen: Array<Bewertung>

  bewertungenDataSource: MatTableDataSource<Bewertung>
  displayedColumns: string[] = ['person', 'wertung'];

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
