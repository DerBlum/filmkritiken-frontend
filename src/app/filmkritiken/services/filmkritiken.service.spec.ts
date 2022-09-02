import { TestBed } from '@angular/core/testing';

import { FilmkritikenFrontendService } from './filmkritiken.service';

describe('FilmkritikenService', () => {
  let service: FilmkritikenFrontendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilmkritikenFrontendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
