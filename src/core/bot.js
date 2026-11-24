const { Bot } = require('grammy');
const config = require('../config/default');

// Token bo'lmasa bot yaratilmaydi, lekin API va Admin Panel ishlayveradi.
const bot = config.botToken ? new Bot(config.botToken) : null;

module.exports = bot;
