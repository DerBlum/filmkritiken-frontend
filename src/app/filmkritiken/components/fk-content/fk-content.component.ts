import { Component, Input, OnInit } from '@angular/core';
import { Filmkritiken } from 'src/app/openapi';

@Component({
  selector: 'fk-content',
  templateUrl: './fk-content.component.html',
  styleUrls: ['./fk-content.component.css'],
})
export class FkContentComponent implements OnInit {

  @Input()
  filmkritiken: Filmkritiken;

  constructor() { }

  ngOnInit(): void { }

}
