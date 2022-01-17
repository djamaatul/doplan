const { Op } = require('sequelize');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { users } = require('../../models');

exports.register = async (req, res) => {
	const body = req.body;
	console.log(body);
	const schema = joi.object({
		email: joi.string().email().required(),
		avatar: joi.string().pattern(/\d+|\w+\.[jpg,jpeg,png,svg,JPG,JPEG,PNG,SVG]+/),
		password: joi.string().min(4).required(),
		firstName: joi.string().min(1).required(),
		lastName: joi.string().min(1).required(),
		phone: joi
			.string()
			.min(11)
			.pattern(/^\+\d+/),
	});
	const { error } = schema.validate(body);

	if (error) {
		return res.status(400).send({
			status: 'failed',
			message: error.details[0].message,
		});
	}
	try {
		const userExist = await users.findAll({
			where: {
				[Op.or]: [{ email: body.email }, { phone: body.phone }],
			},
		});
		console.log(userExist);
		if (userExist.length > 0) {
			return res.status(400).send({
				status: 'failed',
				message: 'user email or phone already exist',
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(body.password, salt);

		const registeredData = await users.create({ ...body, password: hashedPassword });

		const token = jwt.sign({ id: registeredData.dataValues.id }, process.env.SECRET_KEY);
		return res.status(200).send({
			status: 'success',
			data: { email: body.email, firstName: body.firstName, lastName: body.lastName, token },
		});
	} catch (error) {
		return res.status(500).send({
			status: 'failed',
			message: 'register server error',
		});
	}
};

exports.login = async (req, res) => {
	const body = req.body;
	const schema = joi.object({
		email: body.email ?? joi.string().email(),
		password: joi.string().min(4).required(),
		phone:
			body.phone ??
			joi
				.string()
				.min(11)
				.pattern(/^\+\d+/),
	});
	const { error } = schema.validate(body);

	if (error) {
		return res.status(400).send({
			status: 'failed',
			message: error.details[0].message,
		});
	}
	try {
		const userExist = await users.findOne({
			where: {
				[Op.or]: [
					{
						email: body.email ? body.email : '',
					},
					{
						phone: body.phone ? body.phone : '',
					},
				],
			},
		});
		if (!userExist) {
			return res.status(404).send({
				status: 'failed',
				message: 'email or phone user not exist',
			});
		}
		const authenticate = await bcrypt.compare(body.password, userExist.password);
		console.log(body.password, userExist.password);

		if (!authenticate) {
			res.status(401).send({
				status: 'failed',
				message: 'email and password combination not match',
			});
		}

		const token = jwt.sign({ id: userExist.id }, process.env.SECRET_KEY);

		return res.status(200).send({
			status: 'success',
			data: {
				token,
				profile: {
					id: 1,
					firstName: userExist.firstName,
					lastName: userExist.lastName,
					email: userExist.email,
					avatar: null,
					phone: userExist.phone,
				},
			},
		});
	} catch (error) {
		return res.status(500).send({
			status: 'failed',
			message: 'login server error',
		});
	}
};

// exports.getProfile = async (req, res) => {
// 	const id = req.user.id;
// 	try {
// 		const profileData = await users.findOne({
// 			where: {
// 				id,
// 			},
// 		});
// 		res.status(200).send({
// 			status: 'success',
// 			data: { ...profileData },
// 		});
// 	} catch (error) {
// 		res.status(500).send({
// 			status: 'failed',
// 			message: 'get profile server error',
// 		});
// 	}
// };
