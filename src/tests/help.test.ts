import { CommandContext } from "grammy";
import { HelpFunction } from "../middleware/help";
import { CustomContext } from "../bot";

describe('help command', () => {
  it('should respond with help information', async () => {
    const ctx = {
      reply: jest.fn(),
      from: { id: 123, is_bot: false, first_name: 'John' },
    } as unknown as CommandContext<CustomContext>;
    
    const reg = '\n/register - Регистрация'
    const anek = '\n/anekdot - Получить анекдот'
    const help = '\n/help - Справка'
    const contact = '\n/contact - Контакты'
    const auth = '\n/auth - Авторизация'

    const expectedResponse = `Команды бота: ${reg} ${anek} ${help} ${contact} ${auth}`;

    await HelpFunction(ctx);
    expect(ctx.reply).toHaveBeenCalledWith(expectedResponse);
  });

  it('should be called with correct context', async () => {
    const ctx = {
      reply: jest.fn(),
      from: { id: 123, is_bot: false, first_name: 'John' },
    } as unknown as CommandContext<CustomContext>;

    await HelpFunction(ctx);
    expect(ctx.reply).toHaveBeenCalledTimes(1);
    expect(ctx.reply).toHaveBeenCalledWith(expect.any(String));
  });
});