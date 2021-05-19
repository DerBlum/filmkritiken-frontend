import { Component, Input, OnInit } from '@angular/core';
import { Image } from 'src/app/openapi';

@Component({
  selector: 'fk-image',
  templateUrl: './fk-image.component.html',
  styleUrls: ['./fk-image.component.css']
})
export class FkImageComponent implements OnInit {

  @Input()
  image: Image;

  constructor() { }

  ngOnInit(): void {
  }

}
