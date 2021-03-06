const router = express.Router();
const customersController = require('../controllers/customersController');
const validatePartner = require('../validators/validatePartner');
const validateLogin = require('../validators/validateLogin');
const validateInvite = require('../validators/validateInvite');

// router.post('/login', validateLogin.rules, customersController.login);
router.get('/get', customersController.get);
// router.get('/getTypes', customersController.getTypes);
// router.get('/getOne', checkAdmin, employeesController.getOne);
// router.post('/add', checkAdmin, uploadProfileImg, validatePartner.rules, employeesController.add);
// router.put('/update', checkAdmin, validatePartner.rules, employeesController.update);
// router.delete('/remove', checkAdmin, employeesController.remove);
// router.post('/invite', validateInvite.rules, employeesController.invite)

module.exports = router;
