'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class plans extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			plans.belongsTo(models.users, {
				as: 'users',
				foreignKey: 'userid',
			});
		}
	}
	plans.init(
		{
			title: DataTypes.STRING,
			body: DataTypes.STRING,
			date: DataTypes.DATE,
			userid: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'plans',
		}
	);
	return plans;
};
