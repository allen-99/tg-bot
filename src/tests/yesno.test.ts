import { CommandContext } from "grammy";
import { YesnoFunction } from "../middleware/yesno";
import { CustomContext } from "../bot";

describe('yesno command', () => {
  it('should respond with "Да" or "Нет"', async () => {
    const ctx = {
      reply: jest.fn(),
      from: { id: 123, is_bot: false, first_name: 'John' },
    } as unknown as CommandContext<CustomContext>;

    // мок для проверки
    jest.spyOn(Math, 'random').mockReturnValue(0.5); // 0.5 -> "Нет"
    
    await YesnoFunction(ctx);
    expect(ctx.reply).toHaveBeenCalledWith("Нет");

    jest.spyOn(Math, 'random').mockReturnValue(0); // 0 -> "Да"

    await YesnoFunction(ctx);
    expect(ctx.reply).toHaveBeenCalledWith("Да");

    // востанавливаем обратно
    jest.spyOn(Math, 'random').mockRestore();
  });

  it('should respond with either "Да" or "Нет" randomly', async () => {
    const ctx = {
      reply: jest.fn(),
      from: { id: 123, is_bot: false, first_name: 'John' },
    } as unknown as CommandContext<CustomContext>;

    await YesnoFunction(ctx);
    expect(ctx.reply).toHaveBeenCalledWith(expect.stringMatching(/Да|Нет/));
  });
});