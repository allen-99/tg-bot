import { CommandContext } from "grammy"

import { CustomContext } from "../bot"

export const AnekdotFunction = async (ctx: CommandContext<CustomContext>) => {
  const joke = await getRandomJoke();
  await ctx.reply(joke);
}

async function getRandomJoke(): Promise<string> {
  const url = "https://api.chucknorris.io/jokes/random";
  try {
    const response = await fetch(url);
    const data: { value: string } = await response.json() as { value: string };
    return data.value;
  } catch (error) {
    console.error("Ошибка при получении анекдота:", error);
    return "Произошла ошибка при попытке получить анекдот.";
  }
}