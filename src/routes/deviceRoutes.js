
const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController'); 
const deviceReturn = require('../controllers/deviceReturnController'); 
const { authorize } = require('../middleware/auth');


router.post('/add', authorize,deviceController.addDevice);


router.put('/:id', authorize,deviceController.updateDevice);
router.get('/:id', authorize,deviceController.getDeviceById);
router.get('/', authorize,deviceController.getAllDevices);

router.post('/assign', deviceController.assignDevice);

router.post('/return', deviceReturn.returnDevice);
module.exports = router;

