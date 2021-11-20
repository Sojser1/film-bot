require('dotenv').config()

const {Telegraf, Markup} = require('telegraf')
const fs = require('fs')

const bot = new Telegraf(process.env.BOT_TOKEN)

const help = require('./help.js')
const type = require('./enums/video-type.js').type

const pathFilm = './data/film.json';
const path = './data'


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
        fs.readFile(pathFilm, async (e, data) => {
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

function save(type, name, username, date) {
    try {
        const d = new Date(date * 1000).toLocaleDateString();
        const time = new Date(date * 1000).toLocaleTimeString();
        fs.readFile(pathFilm, (e, data) => {
            let list;
            if (data) {
                list = JSON.parse(data);
            } else {
                list = {};

            }
            if (!list[type]) {
                list[type] = [];
            }
            const newVideoObject = {
                filmName: name,
                username,
                date: `${d} ${time}`
            };

            list[type].push(newVideoObject);
            fs.writeFile(pathFilm, JSON.stringify(list), (e, r) => {
            });
        })
    } catch (e) {
        errorHandler(e)
    }

}

function returnViewHTML(data) {
    try {
        let res = ``;
        Object.keys(data).forEach(janr => {
            res = res.concat(`\n${type[janr].title}ы:\n`)
            data[janr].forEach(videoInfo => {
                res = res.concat(`${createTitleCaseName(videoInfo.filmName)} - ${videoInfo.username} ${videoInfo.date}\n`)
            })
        })
        return res;
    } catch (e) {
        errorHandler(e)
    }

}

function createTitleCaseName(name) {
    try {
        const nameArray = name.trim().split('');
        nameArray[0] = nameArray[0].toUpperCase();
        return nameArray.join('');
    } catch (e) {
        console.log(e)
    }

}

function createDir() {
    fs.mkdir(path, err => {
        if (err) throw err;
    })
}


addAction('film', 'Введите название фильма')
addAction('mult', 'Введите название мультфильма')
addAction('serial', 'Введите название сериала')

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))