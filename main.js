const { Telegraf, Markup } = require('telegraf');
const Express = require('express');
const BodyParser = require('body-parser');

let order = {};

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
    const currentOrder = order;
    console.log(message.chat.type);
    ctx.editMessageText({chat_id: process.env.GROUP_ID, message_id: message.message_id, text: message.text + '\n В работу взял ' + from.first_name, reply_markup: null});
    await bot.telegram.sendMessage(from.id, 'Ура! У тебя новый заказ!\n ' + currentOrder.phone + currentOrder.place);
})

bot.launch();

const app = Express();

app.use(BodyParser.json());

app.use(BodyParser.urlencoded({ extended: true }));

app.post("/", (req, res) => {
    const { machineId, attachmentId, phone, place, date } = req.body;
    const id = 1;
    order = { id, machineId, attachmentId, phone, place, date }
    bot.telegram.sendMessage(process.env.GROUP_ID, 'Новый заказ!\n' + phone + place, Markup.inlineKeyboard([
        Markup.button.callback('Беру заказ', id.toString())
    ]))
});

app.listen();