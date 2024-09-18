
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authorize } = require('../middleware/auth');
const { validateEmployee } = require('../middleware/validateEmployee');
const { checkDuplicateEmployee } = require('../middleware/checkDuplicateMiddleware');

router.post('/', authorize,validateEmployee,checkDuplicateEmployee,employeeController.createEmployee);
router.put('/:id', authorize,employeeController.updateEmployee);
router.delete('/:id', authorize,employeeController.deleteEmployee);
router.get('/:id', authorize,employeeController.getEmployeeById);
router.get('/', employeeController.getAllEmployees);

module.exports = router;
//,validateEmployee,checkDuplicateEmployee