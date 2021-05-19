import { Component, Input, OnInit } from '@angular/core';
import { Filmkritiken } from 'src/app/openapi';

@Component({
  selector: 'fk-filminfo',
  templateUrl: './fk-filminfo.component.html',
  styleUrls: ['./fk-filminfo.component.css']
})
export class FkFilminfoComponent implements OnInit {

  @Input()
  filmkritiken: Filmkritiken;
  besprochenAm: Date;

  constructor() { }

  ngOnInit(): void {
    let ba = this.filmkritiken?.details?.besprochenam;
    if (ba) {
      this.besprochenAm = new Date(this.filmkritiken.details.besprochenam)
    }
  }

}
