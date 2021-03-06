require('../constants/sequelize');

const rules = [
    body('first_name').not().isEmpty().withMessage('First name is required'),
    body('email').not().isEmpty().withMessage('E-mail is required').isEmail().withMessage('Email is invalid'),
    body('last_name').not().isEmpty().withMessage('Last name is required'),
    body('pass').not().isEmpty().withMessage('Password is required'),
    body('partner_type_id').not().isEmpty().withMessage('Partner type is required'),
    body().custom(async (req) => {
        let lang = req.lang;
        let email = req.email;

        // Retrieving a user with request email
        let partner = await Users.findOne({where: {email: email}, attributes: ['email']});

        // Checking if user wrote first name and last name
        if (req['first_name_' + lang] === '' || req['last_name_' + lang] === '') {
            throw new Error('full_name_required_error')
        } else if (partner != null) throw new Error('E-mail exists');

    }),


];

module.exports = {
    rules
};