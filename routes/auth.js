const router = express.Router();
const authController = require('../controllers/authController');
const validateRegister = require('../validators/validateRegister');
const validateProfile = require('../validators/validateProfile');
const validateLogin = require('../validators/validateLogin');
const passport = require('passport');

router.post('/register', uploadProfileImg, validateRegister.rules, authController.register);
router.post('/login', validateLogin.rules, authController.login);

// router.use(checkAuth);

router.put('/update-profile', checkAuth, uploadProfileImg, validateProfile.rules, authController.updateProfile);
router.get('/get-profile', checkAuth, authController.getProfile);


// Passport.js Google auth routes
router.get('/google', passport.authenticate('google', {session: false, scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    scope: ['email', 'openid', 'profile'],
    session: false
}), (req, res) => {
    // console.log('routes!!!!')
    // console.log(req.user.toJSON())
    let token = jwt.sign(req.user.toJSON(), 'secretkey', {expiresIn: '8h'});
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
});


// Passport.js Facebook auth routes
router.get('/facebook', passport.authenticate('facebook', {session: false}));
router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    scope: ['email', 'openid', 'profile'],
    session: false
}), (req, res) => {
    let token = jwt.sign(req.user, 'secretkey', {expiresIn: '8h'});
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
});

module.exports = router;
