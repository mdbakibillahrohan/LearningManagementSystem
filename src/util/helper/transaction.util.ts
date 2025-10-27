import { DataSource, QueryRunner } from "typeorm";

export const runInTransaction = async <T>(
  dataSource: DataSource,
  callback: (qr: QueryRunner) => Promise<T>,
): Promise<T> => {
  const qr = dataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();
  try {
    const result = await callback(qr);
    await qr.commitTransaction();
    return result;
  } catch (err) {
    await qr.rollbackTransaction();
    throw err;
  } finally {
    await qr.release();
  }
};