const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('OKE');
});

module.exports = router;
