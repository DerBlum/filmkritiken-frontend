import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FkTableComponent } from './fk-table.component';
import { UserService } from 'src/app/shared/user/user.service';
import { FilmkritikenFrontendService } from '../../services/filmkritiken.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FkTableComponent', () => {
  let component: FkTableComponent;
  let fixture: ComponentFixture<FkTableComponent>;
  let mockUserService: any;
  let mockFilmkritikenService: any;

  beforeEach(async () => {
    mockUserService = {
      subscribeToLoginState: vi.fn(),
      isLoggedIn: vi.fn(),
      hasRole: vi.fn()
    };
    mockUserService.subscribeToLoginState.mockImplementation((observer: any) => { });
    mockUserService.isLoggedIn.mockReturnValue(false);
    mockUserService.hasRole.mockReturnValue(false);

    mockFilmkritikenService = {
      openCloseBewertungen: vi.fn(),
      setBewertung: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatSnackBarModule, MatTableModule],
      declarations: [FkTableComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: FilmkritikenFrontendService, useValue: mockFilmkritikenService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FkTableComponent);
    component = fixture.componentInstance;
    component.filmkritiken = { bewertungen: [], id: '1', date: '', details: {}, name: '', userinfo: {} } as any; // Mock Input
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
