import { CommandContext } from "grammy";
import { RegisterFunction } from "../middleware/register";
import { CustomContext } from "../bot";
import { dbPromise } from "../database";

jest.mock("../database", () => ({
  dbPromise: Promise.resolve({
    get: jest.fn(),
    run: jest.fn()
  })
}));

jest.mock("crypto", () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from('a1b2c3d4e5f6', 'hex'))
}));

describe('register command', () => {
  let mockDb: any;

  beforeAll(async () => {
    mockDb = await dbPromise;
  });

  beforeEach(() => {
    // отчистка моков перед каждым тестом
    jest.clearAllMocks(); 
  });

  it('should register a new user and respond with auth key', async () => {
    mockDb.get.mockResolvedValueOnce(undefined);
    mockDb.run.mockResolvedValueOnce({});

    const ctx = {
      from: { id: 123, is_bot: false, first_name: 'John', last_name: 'Doe', username: 'johndoe' },
      reply: jest.fn(),
      session: {}
    } as unknown as CommandContext<CustomContext>;

    const expectedAuthKey = 'a1b2c3d4e5f6';
    const expectedResponse = `Спасибо за регистрацию, John! Ваш ключ: \n/auth ${expectedAuthKey}`;

    await RegisterFunction(ctx);
    expect(ctx.session.authKey).toBe(expectedAuthKey);
    expect(ctx.reply).toHaveBeenCalledWith(expectedResponse);
    expect(mockDb.run).toHaveBeenCalledWith(
      "INSERT INTO users (id, firstName, lastName, username) VALUES (?, ?, ?, ?)",
      [123, 'John', 'Doe', 'johndoe']
    );
  });

  it('should respond with auth key for already registered users', async () => {
    mockDb.get.mockResolvedValueOnce({ id: 123 });

    const ctx = {
      from: { id: 123, is_bot: false, first_name: 'John', last_name: 'Doe', username: 'johndoe' },
      reply: jest.fn(),
      session: {}
    } as unknown as CommandContext<CustomContext>;

    const expectedAuthKey = 'a1b2c3d4e5f6';
    const expectedResponse = `Ваш ключ: \n/auth ${expectedAuthKey}`;

    await RegisterFunction(ctx);
    expect(ctx.session.authKey).toBe(expectedAuthKey);
    expect(ctx.reply).toHaveBeenCalledWith(expectedResponse);
    expect(mockDb.run).not.toHaveBeenCalled();
  });
});