/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StackedareaComponent } from './stackedarea.component';

describe('StackedareaComponent', () => {
  let component: StackedareaComponent;
  let fixture: ComponentFixture<StackedareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
