import { TestBed } from '@angular/core/testing';

import { TrafficsService } from './traffics.service';

describe('TrafficsService', () => {
  let service: TrafficsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrafficsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
