const router = express.Router();
const foodDrinkController = require('../controllers/foodDrinkController');
const validateFoodDrink = require('../validators/validateFoodDrink');

router.get('/get', foodDrinkController.get);
router.get('/get-partners', foodDrinkController.getPartners);
router.get('/get-orders', foodDrinkController.getOrders);
router.get('/get-client-orders', foodDrinkController.getClientOrders);
router.get('/getOne', foodDrinkController.getOne);
router.get('/get-by-address', foodDrinkController.getByAddress);
router.post('/add', uploadImages, validateFoodDrink.rules, foodDrinkController.add);
router.put('/update', uploadImages, validateFoodDrink.rules, foodDrinkController.update);
router.put('/make-cover', checkAuth, checkRole('admin', 'partner'), foodDrinkController.makeCover);
router.delete('/remove', foodDrinkController.remove);
router.delete('/remove-image', foodDrinkController.removeImage);

module.exports = router;
