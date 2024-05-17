import { Bot, Context, session, SessionFlavor } from "grammy";
import * as dotenv from 'dotenv';

import { setup } from "./database";

import { ensureRegistered } from "./middleware/ensure-registered";
import { AnekdotFunction } from "./middleware/get-anekdot";
import { RegisterFunction } from "./middleware/register"
import { HelpFunction } from "./middleware/help";
import { YesnoFunction } from "./middleware/yesno";
import { ContactFunction } from "./middleware/contact";

interface SessionData {
  authorized: boolean;
  authKey?: string;
}

export type CustomContext = Context & SessionFlavor<SessionData>;


dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) throw new Error("Необходимо указать TELEGRAM_BOT_TOKEN в файле .env");

export const bot = new Bot<CustomContext>(token);

bot.use(session({ initial: (): SessionData => ({ authorized: false }) }));

bot.command("register", RegisterFunction);

bot.command("auth", async (ctx) => {
  const key = ctx.message?.text.split(" ")[1];

  if (key === ctx.session.authKey) {
    ctx.session.authorized = true;
    await ctx.reply("Вы успешно авторизованы! Введите /help для просмотра списка команд.");
  } else {
    await ctx.reply("Неверный авторизационный ключ.");
  }
});

bot.use(async (ctx, next) => {
  if (ctx.session.authorized) {
    await next();
  } else {
    await ctx.reply("Для работы с ботом вам необходимо авторизоваться. Введите /auth <ключ>. Для генерации ключа используйте /register");
  }
});

bot.command("anekdot", ensureRegistered, AnekdotFunction);

bot.command("yesno", YesnoFunction);

bot.command("help", HelpFunction);

bot.command("contact", ContactFunction);

bot.use(async (ctx, next) => {
  if (ctx.message?.text?.startsWith("/")) {
    ctx.reply("Неизвестная команда. Введите /help для просмотра списка команд.");
  } else {
    await next();
  }
});

setup().then(() => {
  bot.start();
});