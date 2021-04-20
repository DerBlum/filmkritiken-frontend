import { TestBed } from '@angular/core/testing';

import { FilmkritikenService } from './filmkritiken.service';

describe('FilmkritikenService', () => {
  let service: FilmkritikenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilmkritikenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
