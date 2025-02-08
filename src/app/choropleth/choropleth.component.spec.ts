/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChoroplethComponent } from './choropleth.component';

describe('ChloroplethComponent', () => {
  let component: ChoroplethComponent;
  let fixture: ComponentFixture<ChoroplethComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoroplethComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoroplethComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
