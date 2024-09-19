const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController'); 
const deviceReturn = require('../controllers/deviceReturnController'); 
const { checkDuplicateSerial } = require('../middleware/deviceMiddleware')
//const { authorize } = require('../middleware/auth');


router.post('/add', checkDuplicateSerial,deviceController.addDevice);


router.put('/:id', checkDuplicateSerial,deviceController.updateDevice);
router.get('/:id',deviceController.getDeviceById);
router.get('/', deviceController.getAllDevices);

router.post('/assign', deviceController.assignDevice);

router.post('/return', deviceReturn.returnDevice);
router.get('/device-history/:device_id', deviceController.getDeviceHistory);
router.get('/search', deviceController.searchDevices);

module.exports = router;

