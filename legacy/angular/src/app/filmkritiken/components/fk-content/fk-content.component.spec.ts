import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

import { FkContentComponent } from './fk-content.component';

describe('FkContentComponent', () => {
  let component: FkContentComponent;
  let fixture: ComponentFixture<FkContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FkContentComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FkContentComponent);
    component = fixture.componentInstance;
    component.filmkritiken = { film: { id: 'film-id' }, bewertungen: [], id: '1', date: '', details: {}, name: '', userinfo: {} } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
