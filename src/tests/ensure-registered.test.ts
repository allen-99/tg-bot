import { Context, NextFunction } from "grammy";
import { ensureRegistered } from "../middleware/ensure-registered";
import { dbPromise } from "../database";

// мок dbPromise
jest.mock("../database", () => ({
  dbPromise: Promise.resolve({
    get: jest.fn()
  })
}));

describe('ensure-registered middleware', () => {
  let mockDb: any;
  
  beforeAll(async () => {
    mockDb = await dbPromise;
  });

  it('should call next() for registered users', async () => {
    mockDb.get.mockResolvedValueOnce({ id: 123 });
    
    const ctx = {
      from: { id: 123, is_bot: false, first_name: 'John' },
      reply: jest.fn()
    } as unknown as Context;
    
    const next = jest.fn() as unknown as NextFunction;

    await ensureRegistered(ctx, next);
    expect(next).toHaveBeenCalled();
  });

  it('should prompt registration for unregistered users', async () => {
    mockDb.get.mockResolvedValueOnce(undefined);

    const ctx = {
      from: { id: 456, is_bot: false, first_name: 'Jane' },
      reply: jest.fn()
    } as unknown as Context;

    const next = jest.fn() as unknown as NextFunction;

    await ensureRegistered(ctx, next);
    expect(ctx.reply).toHaveBeenCalledWith("Пожалуйста, зарегистрируйтесь сначала используя /register.");
    expect(next).not.toHaveBeenCalled();
  });
});