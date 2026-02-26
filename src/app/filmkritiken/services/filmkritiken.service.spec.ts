import { TestBed } from '@angular/core/testing';
import { FilmkritikenFrontendService } from './filmkritiken.service';
import { BewertungenService, FilmkritikenService, FilmeService } from 'src/app/openapi';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FilmkritikenFrontendService', () => {
  let service: FilmkritikenFrontendService;
  let mockFilmkritikenService: any;
  let mockFilmeService: any;
  let mockBewertungenService: any;

  beforeEach(() => {
    mockFilmkritikenService = {
      apiFilmkritikenGet: vi.fn(),
      apiFilmkritikenFilmkritikenIdBesprochenAmPatch: vi.fn()
    };
    mockFilmeService = {
      apiFilmePost: vi.fn()
    };
    mockBewertungenService = {
      apiFilmkritikenFilmkritikenIdBewertungenoffenOffenPatch: vi.fn(),
      apiFilmkritikenFilmkritikenIdBewertungenUsernamePut: vi.fn()
    };

    // Setup default mock returns
    mockFilmkritikenService.apiFilmkritikenGet.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        FilmkritikenFrontendService,
        { provide: FilmkritikenService, useValue: mockFilmkritikenService },
        { provide: FilmeService, useValue: mockFilmeService },
        { provide: BewertungenService, useValue: mockBewertungenService }
      ]
    });
    service = TestBed.inject(FilmkritikenFrontendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
