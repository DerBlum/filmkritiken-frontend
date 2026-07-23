import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppComponent } from './app.component';
import { UserService } from './shared/user/user.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { provideRouter } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockUserService: any;

  beforeEach(async () => {
    mockUserService = {
      subscribeToLoginState: vi.fn(),
      isLoggedIn: vi.fn(),
      hasRole: vi.fn(),
      loginViaPopup: vi.fn(),
      getAuthToken: vi.fn(),
      logout: vi.fn()
    };
    mockUserService.subscribeToLoginState.mockImplementation((observer: any) => { });
    mockUserService.isLoggedIn.mockReturnValue(false);
    mockUserService.hasRole.mockReturnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        MatDialogModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        ClipboardModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: mockUserService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'filmkritiken-frontend'`, () => {
    expect(component.title).toEqual('filmkritiken-frontend');
  });
});
