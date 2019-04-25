'use strict';
module.exports = (sequelize, DataTypes) => {
    const accommodation = sequelize.define('accommodations', {
        partner_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        lat: DataTypes.STRING,
        lng: DataTypes.STRING,
        address: DataTypes.TEXT,
        img: DataTypes.STRING
    }, {timestamps: false, underscored: true});
    accommodation.associate = function (models) {
        // associations can be defined here
        accommodation.belongsTo(models.users, {foreignKey: 'partner_id'})
    };
    return accommodation;
};