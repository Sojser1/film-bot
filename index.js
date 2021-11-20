require('dotenv').config()

const {Telegraf, Markup} = require('telegraf')
const fs = require('fs')

const bot = new Telegraf(process.env.BOT_TOKEN)

const help = require('./help.js')
const type = require('./enums/video-type.js').type

const path = require('./const/path').path
const {save} = require('./handlers/save')
const {returnViewHTML} = require('./handlers/returnViewHTML')


bot.start(async (ctx) => {
    try {
        await ctx.reply('Привет, привет')
        await ctx.reply(help.commands)
        createDir()
    } catch (e) {
        console.log(e)
    }
})

bot.help((ctx) => ctx.reply(help.commands))

bot.command('new', async (ctx) => {
    try {
        await ctx.replyWithHTML("<b>Выберите жанр</b>", Markup.inlineKeyboard(
            [
                [Markup.button.callback(type['film'].title, 'film'),
                    Markup.button.callback(type['mult'].title, 'mult'),
                    Markup.button.callback(type['serial'].title, 'serial'),
                ],
            ]
        ))
    } catch (e) {
        errorHandler(e)
    }

})

bot.command('view', (ctx) => {
    try {
        fs.readFile(path.pathFilm, async (e, data) => {
            if (!data) {
                errorHandler(ctx, `Вы пока ничего не добавили\n/new - Добавить`);
                return
            }
            const response = returnViewHTML(JSON.parse(data));
            if (!response.length) {
                errorHandler(ctx, `Вы пока ничего не добавили\n/new - Добавить`);
            } else {
                await ctx.reply(response);
            }
        })
    } catch (e) {
        errorHandler(e)
    }

})

function addAction(name, text) {
    try {
        bot.action(name, async (ctx) => {
            await ctx.answerCbQuery();
            await ctx.reply(text)
            await bot.hears(/.*/, async (ctx) => {
                const {message} = ctx.update;
                const {from, date} = message;
                await save(name, message.text, from.username, date)
                await ctx.reply(type[name].title + `, ${message.text}, ` + 'успешно добавлен')
                await ctx.reply(`/start - вернуться в начало \n /new - добавить еще один`)
            })
        })

    } catch (e) {
        errorHandler(e)
    }

}

function errorHandler(ctx, customMessage, error) {
    ctx.reply(customMessage);
    if (error) {
        console.log(error.message)
    }
}

function createDir() {
    fs.mkdir(path.path, err => {
        console.log(err)
    })
}


addAction('film', 'Введите название фильма')
addAction('mult', 'Введите название мультфильма')
addAction('serial', 'Введите название сериала')

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))