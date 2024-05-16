import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingCreationComponent } from './listing-creation.component';

describe('ListingCreationComponent', () => {
  let component: ListingCreationComponent;
  let fixture: ComponentFixture<ListingCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListingCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListingCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
