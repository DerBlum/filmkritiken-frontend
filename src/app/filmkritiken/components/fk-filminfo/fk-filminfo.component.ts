import { Component, Input, OnInit } from '@angular/core';
import { Film } from '../../types/DataTypes';

@Component({
  selector: 'fk-filminfo',
  templateUrl: './fk-filminfo.component.html',
  styleUrls: ['./fk-filminfo.component.css']
})
export class FkFilminfoComponent implements OnInit {

  @Input()
  film: Film;

  constructor() { }

  ngOnInit(): void {
  }

}
