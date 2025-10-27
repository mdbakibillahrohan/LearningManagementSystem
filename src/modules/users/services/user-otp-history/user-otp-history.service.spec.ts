import { Test, TestingModule } from '@nestjs/testing';
import { UserOtpHistoryService } from './user-otp-history.service';

describe('UserOtpHistoryService', () => {
  let service: UserOtpHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserOtpHistoryService],
    }).compile();

    service = module.get<UserOtpHistoryService>(UserOtpHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
