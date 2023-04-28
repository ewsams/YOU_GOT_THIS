import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogLoginComponent } from './blog-login.component';

describe('BlogLoginComponent', () => {
  let component: BlogLoginComponent;
  let fixture: ComponentFixture<BlogLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
