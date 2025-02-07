/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChloroplethComponent } from './chloropleth.component';

describe('ChloroplethComponent', () => {
  let component: ChloroplethComponent;
  let fixture: ComponentFixture<ChloroplethComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChloroplethComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChloroplethComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
