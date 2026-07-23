import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

import { FkImageComponent } from './fk-image.component';

describe('FkImageComponent', () => {
  let component: FkImageComponent;
  let fixture: ComponentFixture<FkImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FkImageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FkImageComponent);
    component = fixture.componentInstance;
    component.image = { id: 'image-id' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
