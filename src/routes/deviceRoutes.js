
const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController'); 
const { authorize } = require('../middleware/auth');


router.post('/add', authorize,deviceController.addDevice);


router.put('/:id', authorize,deviceController.updateDevice);
router.get('/:id', authorize,deviceController.getDeviceById);
router.get('/', authorize,deviceController.getAllDevices);

router.post('/assign', authorize,deviceController.assignDevice);
module.exports = router;

