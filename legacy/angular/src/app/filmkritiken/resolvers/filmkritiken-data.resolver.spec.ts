import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { FilmkritikenDataResolver } from './filmkritiken-data.resolver';

describe('FilmkritikenDataResolver', () => {
  let resolver: FilmkritikenDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    resolver = TestBed.inject(FilmkritikenDataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
