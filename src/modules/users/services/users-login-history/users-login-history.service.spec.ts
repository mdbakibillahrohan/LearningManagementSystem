import { Test, TestingModule } from '@nestjs/testing';
import { UsersLoginHistoryService } from './users-login-history.service';

describe('UsersLoginHistoryService', () => {
  let service: UsersLoginHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersLoginHistoryService],
    }).compile();

    service = module.get<UsersLoginHistoryService>(UsersLoginHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
