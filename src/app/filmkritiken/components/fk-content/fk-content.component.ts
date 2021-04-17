import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Filmbewertungen, Film, Bewertung } from '../../types/DataTypes';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'fk-content',
  templateUrl: './fk-content.component.html',
  styleUrls: ['./fk-content.component.css'],
})
export class FkContentComponent implements OnInit {

  @Input()
  filmbewertungen: Filmbewertungen;

  constructor() { }

  ngOnInit(): void { }

}
