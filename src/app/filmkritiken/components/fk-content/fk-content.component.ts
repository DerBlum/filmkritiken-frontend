import { Component, Input, OnInit } from '@angular/core';
import { Filmbewertungen } from '../../types/DataTypes';

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
