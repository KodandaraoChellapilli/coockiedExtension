import { TestBed } from '@angular/core/testing';

import { Chrome } from './chrome';

describe('Chrome', () => {
  let service: Chrome;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Chrome);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
