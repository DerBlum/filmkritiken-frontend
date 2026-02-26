import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FkAddFilmDialogComponent } from './fk-add-film-dialog.component';
import { UserService } from 'src/app/shared/user/user.service';
import { FilmkritikenFrontendService } from '../../services/filmkritiken.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FkAddFilmDialogComponent', () => {
  let component: FkAddFilmDialogComponent;
  let fixture: ComponentFixture<FkAddFilmDialogComponent>;
  let mockUserService: any;
  let mockFilmkritikenService: any;
  let mockDialogRef: any;

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
      addFilm: vi.fn()
    };
    mockDialogRef = {
      close: vi.fn(),
      updateSize: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
      declarations: [FkAddFilmDialogComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: FilmkritikenFrontendService, useValue: mockFilmkritikenService },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FkAddFilmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
