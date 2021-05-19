import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Bewertung } from 'src/app/openapi';
import { getAverageWertung } from '../../utilities/BewertungUtilities';

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

  getAverageWertung(): string {
    return getAverageWertung(this.bewertungen);
  }

}
