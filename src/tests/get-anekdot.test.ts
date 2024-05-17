import { CommandContext } from "grammy";
import { AnekdotFunction } from "../middleware/get-anekdot";
import { CustomContext } from "../bot";

// Мокирование глобальной функции fetch
global.fetch = jest.fn();

describe('anekdot command', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should respond with a joke when fetch is successful', async () => {
    const mockJoke = "Chuck Norris joke";
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ value: mockJoke })
    });

    const ctx = {
      reply: jest.fn(),
      from: { id: 123, is_bot: false, first_name: 'John' },
    } as unknown as CommandContext<CustomContext>;

    await AnekdotFunction(ctx);
    expect(ctx.reply).toHaveBeenCalledWith(mockJoke);
  });

  it('should respond with an error message when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const ctx = {
      reply: jest.fn(),
      from: { id: 123, is_bot: false, first_name: 'John' },
    } as unknown as CommandContext<CustomContext>;

    await AnekdotFunction(ctx);
    expect(ctx.reply).toHaveBeenCalledWith("Произошла ошибка при попытке получить анекдот.");
  });
});