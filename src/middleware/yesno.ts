import { CommandContext } from "grammy"

import { CustomContext } from "../bot"

export const YesnoFunction = async (ctx: CommandContext<CustomContext>) => {
  const answers = ["Да", "Нет"];
  const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
  await ctx.reply(randomAnswer);
};