import { CommandContext } from "grammy"

import { CustomContext } from "../bot"

export const HelpFunction = (ctx: CommandContext<CustomContext>) => {
  const reg = '\n/register - Регистрация'
  const anek = '\n/anekdot - Получить анекдот'
  const help = '\n/help - Справка'
  const contact = '\n/contact - Контакты'
  const auth = '\n/auth - Авторизация'
  ctx.reply(`Команды бота: ${reg} ${anek} ${help} ${contact} ${auth}`);
}