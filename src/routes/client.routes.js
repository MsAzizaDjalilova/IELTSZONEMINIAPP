const { Router } = require('express');
const c = require('../controllers/clientController');
const { telegramAuth, requireTelegram, rateLimit } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../utils/httpError');

const router = Router();

router.use(telegramAuth);

router.get('/config', c.getConfig);
router.get('/courses', asyncHandler(c.getCourses));
router.post('/leads', rateLimit({ windowMs: 10 * 60 * 1000, max: 6 }), asyncHandler(c.createLead));
router.post('/save', requireTelegram, rateLimit({ windowMs: 60 * 1000, max: 10 }), asyncHandler(c.saveCourse));

module.exports = router;
