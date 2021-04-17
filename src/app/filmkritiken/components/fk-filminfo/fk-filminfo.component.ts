import { Component, Input, OnInit } from '@angular/core';
import { Filmbewertungen } from '../../types/DataTypes';

@Component({
  selector: 'fk-filminfo',
  templateUrl: './fk-filminfo.component.html',
  styleUrls: ['./fk-filminfo.component.css']
})
export class FkFilminfoComponent implements OnInit {

  @Input()
  filmbewertungen: Filmbewertungen;

  constructor() { }

  ngOnInit(): void {
  }

}
