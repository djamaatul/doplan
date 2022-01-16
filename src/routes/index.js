const router = require('express').Router();

const { register, login, getProfile } = require('../controllers/users');
const { getPlans, addPlan, deletePlan, getPlan, updatePlan } = require('../controllers/plans');

const { auth } = require('../middleware/auth');

router.get('/', auth, (req, res) => {
	res.status(200).send({
		status: 'success',
		message: 'welcome to doplan application',
		iduser: req.user,
	});
});
router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

router.get('/plans', auth, getPlans);
router.get('/plan/:id', auth, getPlan);
router.post('/plan', auth, addPlan);
router.delete('/plan/:id', auth, deletePlan);
router.patch('/plan/:id', auth, updatePlan);

module.exports = router;
