import { TestBed } from '@angular/core/testing';

import { FilmkritikenDataResolver } from './filmkritiken-data.resolver';

xdescribe('FilmkritikenDataResolver', () => {
  let resolver: FilmkritikenDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(FilmkritikenDataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
