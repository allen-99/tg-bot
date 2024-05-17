import { Context, NextFunction } from "grammy";

import { dbPromise } from "../database";


export async function ensureRegistered(ctx: Context, next: NextFunction) {
  const from = ctx.from!;
  const db = await dbPromise;
  const user = await db.get("SELECT id FROM users WHERE id = ?", [from.id]);
  if (user) {
    return next();
  } else {
    return ctx.reply("Пожалуйста, зарегистрируйтесь сначала используя /register.");
  }
}