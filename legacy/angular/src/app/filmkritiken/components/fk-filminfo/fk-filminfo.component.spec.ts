import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FkFilminfoComponent } from './fk-filminfo.component';
import { UserService } from 'src/app/shared/user/user.service';
import { MatDialogModule } from '@angular/material/dialog';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FkFilminfoComponent', () => {
  let component: FkFilminfoComponent;
  let fixture: ComponentFixture<FkFilminfoComponent>;
  let mockUserService: any;

  beforeEach(async () => {
    mockUserService = {
      subscribeToLoginState: vi.fn(),
      isLoggedIn: vi.fn(),
      hasRole: vi.fn()
    };
    mockUserService.subscribeToLoginState.mockImplementation((observer: any) => { });
    mockUserService.isLoggedIn.mockReturnValue(false);
    mockUserService.hasRole.mockReturnValue(false);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [FkFilminfoComponent],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FkFilminfoComponent);
    component = fixture.componentInstance;
    component.filmkritiken = { film: { id: 'film-id', originaltitel: 'Title' }, bewertungen: [], id: '1', date: '', details: {}, name: '', userinfo: {} } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
