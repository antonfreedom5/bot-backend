const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_ID);

bot.command('start', (ctx) => {
    if (ctx.update.message.chat.type === 'group') return;
    ctx.reply('Нажмите на кнопку ниже, чтобы сделать заказ!',
        Markup.inlineKeyboard([
            Markup.button.webApp(
                'Сделать заказ',
                process.env.SITE_URL
            )
        ])
        );
})

bot.on('callback_query', async (ctx) => {
    const id = ctx.update.callback_query.data;
    const message = ctx.update.callback_query.message;
    const from = ctx.update.callback_query.from;
    console.log(message.chat.type);
    ctx.editMessageText({chat_id: process.env.GROUP_ID, message_id: message.message_id, text: message.text + '\n В работу взял ' + from.first_name, reply_markup: null});
    await bot.telegram.sendMessage(from.id, 'Ура! У тебя новый заказ!\n ');
})

bot.launch();