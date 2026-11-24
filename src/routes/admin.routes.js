const { Router } = require('express');
const a = require('../controllers/adminController');
const { adminAuth, rateLimit } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../utils/httpError');

const router = Router();

router.post('/login', rateLimit({ windowMs: 5 * 60 * 1000, max: 10 }), a.login);

router.use(adminAuth);

router.get('/leads', asyncHandler(a.listLeads));
router.get('/stats', asyncHandler(a.leadStats));
router.patch('/leads/:id', asyncHandler(a.updateLead));
router.delete('/leads/:id', asyncHandler(a.deleteLead));

router.get('/courses', asyncHandler(a.listCourses));
router.post('/courses', asyncHandler(a.createCourse));
router.put('/courses/:id', asyncHandler(a.updateCourse));
router.delete('/courses/:id', asyncHandler(a.deleteCourse));

module.exports = router;
