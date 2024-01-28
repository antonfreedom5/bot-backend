import { Telegraf, Markup } from 'telegraf'
import { message } from "telegraf/filters";
import Express from "express";
import BodyParser from "body-parser";

let order = {};

const bot = new Telegraf(process.env.BOT_ID);

bot.command('start', (ctx) => {
    if (ctx.update.message.chat.type === 'group') return;
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

bot.on('callback_query', async (ctx) => {
    const id = ctx.update.callback_query.data;
    const message = ctx.update.callback_query.message;
    const from = ctx.update.callback_query.from;
    const currentOrder = order;
    console.log(message.chat.type);
    ctx.editMessageText({chat_id: -4170265159, message_id: message.message_id, text: message.text + '\n В работу взял ' + from.first_name, reply_markup: null});
    await bot.telegram.sendMessage(from.id, 'Ура! У тебя новый заказ!\n ' + currentOrder.phone + currentOrder.place);
})

bot.launch();

const app = new Express();

app.use(BodyParser.json());

app.use(BodyParser.urlencoded({ extended: true }));

app.post("/post", (req, res) => {
    const { machineId, attachmentId, phone, place, date } = req.body;
    const id = 1;
    order = { id, machineId, attachmentId, phone, place, date }
    bot.telegram.sendMessage(process.env.GROUP_ID, 'Новый заказ!\n' + phone + place, Markup.inlineKeyboard([
        Markup.button.callback('Беру заказ', id.toString())
    ]))
    res.json({ message: "Это стартовая страница нашего приложения" + req.body.user });
});

app.get("/", (req, res) => {
    res.json({ message: "Это стартовая страница нашего приложения" });
});

app.listen();