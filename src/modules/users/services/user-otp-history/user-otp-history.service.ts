import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { UserOtpHistory } from 'src/entities/user-otp-history.entity';
import { ActiveStatus } from 'src/entities/active-status.enum';
import dayjs from 'dayjs';

@Injectable()
export class UserOtpHistoryService {
  constructor(
    @InjectRepository(UserOtpHistory)
    private readonly userOtpHistoryRepository: Repository<UserOtpHistory>,
  ) {}

  /**
   * Generate 6-digit OTP and save to DB
   */
  async generateUserOtp(
    userId: number,
    otpType: 'login' | 'signup' | 'forgot_password',
    queryRunner?: QueryRunner,
  ): Promise<UserOtpHistory> {
    const manager = queryRunner
      ? queryRunner.manager
      : this.userOtpHistoryRepository.manager;

    // Generate proper 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 100000 to 999999

    const otpRecord = manager.create(UserOtpHistory, {
      user_id: userId,
      otp_type: otpType,
      otp: otp.toString(), // Store as string for consistency
      active_status: ActiveStatus.ACTIVE,
      is_expired: false,
      is_used: false,
      is_verified: false,
      expire_time: dayjs().add(10, 'minute').toDate(), // 10 minutes expiry
      created_by: userId,
    });

    return await manager.save(UserOtpHistory, otpRecord);
  }

  /**
   * Find OTP by user, type, and OTP value
   */
  async getUserOtpByUserOtpAndType(
    userId: number,
    otpType: 'login' | 'signup' | 'forgot_password',
    otp: number,
  ): Promise<UserOtpHistory | null> {
    try {
      return await this.userOtpHistoryRepository.findOneOrFail({
        where: {
          user_id: userId,
          otp: otp.toString(),
          otp_type: otpType,
          active_status: ActiveStatus.ACTIVE,
          is_used: false,
          is_expired: false,
        },
      });
    } catch {
      return null;
    }
  }

  /**
   * Verify OTP and mark as used
   */
  async verifyUserOtp(
    userId: number,
    otpType: 'login' | 'signup' | 'forgot_password',
    otp: number,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const manager = queryRunner
      ? queryRunner.manager
      : this.userOtpHistoryRepository.manager;

    const otpRecord = await this.getUserOtpByUserOtpAndType(userId, otpType, otp);

    if (!otpRecord) {
      return false;
    }

    // Check expiry
    if (dayjs().isAfter(otpRecord.expire_time)) {
      otpRecord.is_expired = true;
      await manager.save(UserOtpHistory, otpRecord);
      return false;
    }

    // Mark as verified and used
    otpRecord.is_verified = true;
    otpRecord.is_used = true;

    await manager.save(UserOtpHistory, otpRecord);
    return true;
  }
}