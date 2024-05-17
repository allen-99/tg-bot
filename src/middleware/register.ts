import { CommandContext, Context } from "grammy";
import { randomBytes } from "crypto";

import { dbPromise } from "../database";
import { CustomContext } from "../bot";

export const RegisterFunction = async (ctx: CommandContext<CustomContext>) => {
  const from = ctx.from!;
  const db = await dbPromise;

  const authKey = randomBytes(16).toString('hex');
  ctx.session.authKey = authKey;

  const user = await db.get("SELECT id FROM users WHERE id = ?", [from.id]);
  if (!user) {
    await db.run("INSERT INTO users (id, firstName, lastName, username) VALUES (?, ?, ?, ?)", [
      from.id, from.first_name, from.last_name, from.username
    ]);
    ctx.reply(`Спасибо за регистрацию, ${from.first_name}! Ваш ключ: \n/auth ${authKey}`);
  } else {
    ctx.reply(`Ваш ключ: \n/auth ${authKey}`);
  }
}