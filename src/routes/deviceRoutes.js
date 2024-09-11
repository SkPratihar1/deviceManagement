
const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController'); 


router.post('/add', deviceController.addDevice);


router.put('/:id', deviceController.updateDevice);
router.get('/:id', deviceController.getDeviceById);
router.get('/', deviceController.getAllDevices);

router.post('/assign', deviceController.assignDevice);
module.exports = router;

