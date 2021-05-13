import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Filmbewertungen } from '../../types/DataTypes';
import { getAverageWertung } from '../../utilities/BewertungUtilities';

@Component({
  selector: 'fk-accordion',
  templateUrl: './fk-accordion.component.html',
  styleUrls: ['./fk-accordion.component.css']
})
export class FkAccordionComponent implements OnInit {

  items: Array<Filmbewertungen>;
  mobile: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (window.innerWidth < 960) {
      this.mobile = true;
    }
    this.items = this.route.snapshot.data.filmbewertungen
  }

  getAverageWertung(item: Filmbewertungen): string {
    return getAverageWertung(item.bewertungen);
  }

}
