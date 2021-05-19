import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Filmkritiken } from 'src/app/openapi';
import { getAverageWertung } from '../../utilities/BewertungUtilities';

@Component({
  selector: 'fk-accordion',
  templateUrl: './fk-accordion.component.html',
  styleUrls: ['./fk-accordion.component.css']
})
export class FkAccordionComponent implements OnInit {

  items: Array<Filmkritiken>;
  mobile: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (window.innerWidth < 960) {
      this.mobile = true;
    }
    this.items = this.route.snapshot.data.filmbewertungen
  }

  getAverageWertung(item: Filmkritiken): string {
    return getAverageWertung(item.bewertungen);
  }

}
