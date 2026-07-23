import { Component, Input, OnInit } from '@angular/core';
import { Image } from 'src/app/openapi';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'fk-image',
    templateUrl: './fk-image.component.html',
    styleUrls: ['./fk-image.component.css'],
    standalone: false
})
export class FkImageComponent implements OnInit {

  @Input()
  image: Image;

  backendImageUrl: string;

  constructor() {
  }

  ngOnInit(): void {
    this.fillBackendImageUrl();
  }

  fillBackendImageUrl(): void {
    if (this.image.id && this.image.id.length > 0) {
      this.backendImageUrl = environment.BACKEND_URL + '/api/images/' + this.image.id;
    } else {
      this.backendImageUrl = 'assets/images/' + this.image.source;
    }
  }

}
