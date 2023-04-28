import { TestBed } from '@angular/core/testing';

import { BlogAdminGuard } from './blog-admin.guard';

describe('BlogAdminGuard', () => {
  let guard: BlogAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BlogAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
