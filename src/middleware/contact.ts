import { CommandContext } from "grammy"

import { CustomContext } from "../bot"

export const ContactFunction = (ctx: CommandContext<CustomContext>) => {
  ctx.reply("Контакты для помощи: @allen99");
}