import { Telegraf } from 'telegraf'
import getBotTokenOrQuit from './util/getBotToken';

const botToken = getBotTokenOrQuit();

const bot = new Telegraf(botToken);
let isTimerActive = false;
let timerId: NodeJS.Timeout | undefined = undefined;
const maxTimeAllowed = 60; //seconds


bot.start((ctx) => ctx.reply("Hello!  Let's talk!"))

bot.help((ctx) => ctx.reply(`To start the timer type /timer [seconds] - you can only set a max timer of ${maxTimeAllowed}! To stop the timer type /timer stop`))

bot.hears('hello', (ctx) => ctx.reply('Ok, I heard you say hello'))
bot.command('eggs', (ctx) => ctx.reply("Muhammad had 23 chickens. There are zero now, so no eggs :("))

bot.command('timer', (ctx) => {
    const arrOfMessage = ctx.message.text.split(" ");
    const seconds = arrOfMessage[1];

    function setTimer(seconds: number) {
        timerId = setTimeout(() => {ctx.reply(`Your timer of ${seconds} seconds has ended!`); isTimerActive = false}, seconds * 1000);
    };

    const isTimeValid = parseInt(seconds) <= maxTimeAllowed && parseInt(seconds) > 0;
    
    if (seconds && !isTimerActive && isTimeValid) {
        ctx.reply(`Timer accepted: ${seconds}; I'll give you a shout when the timer runs out :)`);
        isTimerActive = true;
        setTimer(parseInt(seconds))
    } else if (timerId && isTimerActive) {
        clearTimeout(timerId);
        isTimerActive = false;
        timerId = undefined;
        ctx.reply("Your timer has stopped!")
    } else if (!isTimeValid) {
        ctx.reply(`Please select a valid time for me to count - I can't count pass ${maxTimeAllowed} or less than 1 - see ..58, 59, 60, 4, 105, 23... -_-`);
    } else if (isTimerActive) {
        ctx.reply("Sorry, you've got a timer active already - please wait until it's over or cancel it early using /timer stop");
    } else {
        ctx.reply("Oops, please specify how many seconds you want me time for... e.g. /timer 10 or /timer 60");
    }
})


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
