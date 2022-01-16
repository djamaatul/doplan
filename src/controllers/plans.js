const { plans, users } = require('../../models');

exports.getPlans = async (req, res) => {
	const id = req.user.id;
	try {
		const dataPlans = await plans.findAll({
			where: {
				userid: id,
			},
		});
		return res.status(200).send({
			status: 'success',
			data: [...dataPlans],
		});
	} catch (error) {
		return res.status(500).send({
			status: 'failed',
			message: 'get plans server error',
		});
	}
};
exports.getPlan = async (req, res) => {
	const userid = req.user.id;
	const id = req.params.id;
	try {
		const dataPlan = await plans.findOne({
			where: {
				id,
			},
		});
		if (!dataPlan) {
			return res.status(404).send({
				status: 'failed',
				message: 'plan not found',
			});
		}
		if (dataPlan.userid !== userid) {
			return res.status(401).send({
				status: 'failed',
				message: 'access denied : you dont have access',
			});
		}
		return res.status(200).send({
			status: 'success',
			data: dataPlan,
		});
	} catch (error) {
		return res.status(500).send({
			status: 'failed',
			message: 'get plan server error',
		});
	}
};
exports.addPlan = async (req, res) => {
	const id = req.user.id;
	const body = req.body;

	if (!body.title || !body.date) {
		return res.status(400).send({
			status: 'failed',
			message: 'title and date must be there',
		});
	}
	try {
		await plans.create({
			userid: id,
			title: body.title,
			body: body?.body ?? '',
			date: body.date,
			status: false,
		});
		res.status(200).send({
			status: 'sucess',
			data: { iduser: id, title: body.title, body: body?.body ?? '', date: body.date, status: false },
		});
	} catch (error) {
		return res.status(500).send({
			status: 'failed',
			message: 'add plan server error',
		});
	}
};
exports.deletePlan = async (req, res) => {
	const userid = req.user.id;
	const id = req.params.id;

	try {
		const dataPlan = await plans.findOne({
			where: {
				id,
			},
		});
		if (dataPlan.userid !== userid) {
			return res.status(401).send({
				status: 'failed',
				message: 'access denied : you dont have access',
			});
		}

		await plans.destroy({
			where: {
				id,
			},
		});
		return res.status(200).send({
			status: 'success',
			message: `success deleting plan id : ${id}`,
		});
	} catch (error) {
		return res.status(500).send({
			status: 'failed',
			message: 'delete plan server error',
		});
	}
};
exports.updatePlan = async (req, res) => {
	const userid = req.user.id;
	const id = req.params.id;
	const body = req.body;
	console.log(body.status);
	try {
		const dataPlan = await plans.findOne({
			where: {
				id,
			},
		});
		if (dataPlan.userid !== userid) {
			return res.status(401).send({
				status: 'failed',
				message: 'access denied : you dont have access',
			});
		}
		const updateData = {
			title: body?.title ?? dataPlan.title,
			body: body?.body ?? dataPlan.body,
			date: body?.date ?? dataPlan.date,
			status: body?.status ?? dataPlan.status,
		};
		await plans.update(updateData, {
			where: {
				id,
			},
		});
		return res.status(200).send({
			status: 'success',
			message: `success updated plan id : ${id}`,
			data: { id: dataPlan.id, ...updateData },
		});
	} catch (error) {
		return res.status(500).send({
			status: 'failed',
			message: 'delete plan server error',
		});
	}
};
