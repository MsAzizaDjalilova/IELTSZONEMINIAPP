const botController = require('../controllers/botController');

function registerBotRoutes(bot) {
  bot.command('start', botController.handleStart);
  bot.command('contact', botController.handleContact);
  bot.command('help', botController.handleFallback);
  bot.on('message', botController.handleFallback);

  bot.catch((err) => {
    console.error('Bot xatosi:', err.error?.description || err.error?.message || err.message);
  });
}

module.exports = registerBotRoutes;
