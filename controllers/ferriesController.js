require('../constants/sequelize');

exports.get = async (req, res) => {
    let result = await Ferries.findAll({});
    res.json(result);
};