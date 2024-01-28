import { Telegraf, Markup } from 'telegraf'
import { message } from "telegraf/filters";

const bot = new Telegraf(process.env.BOT_ID);

bot.command('start', (ctx) => {
    ctx.reply('Нажмите на кнопку ниже, чтобы сделать заказ!',
        Markup.inlineKeyboard([
            Markup.button.webApp(
                'Сделать заказ',
                'https://antonfreedom5.github.io/'
            )
        ])
        );
})

bot.on(message('web_app_data'), async (ctx) => {
    const data = ctx.webAppData.data.json()
    ctx.reply(`Ваше сообщение: ${data}` ?? 'empty message')
})

bot.launch();