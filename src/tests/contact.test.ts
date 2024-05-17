import { CommandContext } from "grammy";
import { ContactFunction } from "../middleware/contact";
import { CustomContext } from "../bot";

describe('contact command', () => {
  it('should respond with contact information', async () => {
    const ctx = {
      reply: jest.fn(),
      from: { id: 123, is_bot: false, first_name: 'John' },
    } as unknown as CommandContext<CustomContext>;

    await ContactFunction(ctx);
    expect(ctx.reply).toHaveBeenCalledWith("Контакты для помощи: @allen99");
  });
});