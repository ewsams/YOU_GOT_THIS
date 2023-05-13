import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatHistorySidbarComponent } from './chat-history-sidbar.component';

describe('ChatHistorySidbarComponent', () => {
  let component: ChatHistorySidbarComponent;
  let fixture: ComponentFixture<ChatHistorySidbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatHistorySidbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatHistorySidbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
