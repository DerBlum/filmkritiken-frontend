import { Component, Input, OnInit } from '@angular/core';
import { ImageData } from '../../types/DataTypes';

@Component({
  selector: 'fk-image',
  templateUrl: './fk-image.component.html',
  styleUrls: ['./fk-image.component.css']
})
export class FkImageComponent implements OnInit {

  @Input()
  imageData: ImageData;

  constructor() { }

  ngOnInit(): void {
  }

}
