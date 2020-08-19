const express = require('express');
const moment = require('moment');
const router = express.Router();
const { createEmployee, getEmployee, removeEmployee, updateEmployee, getEmployeeWorklogs } = require('../core/employees');
const { getExposedEmployeesEmails } = require('../core/worklogs');
const { sendMail } = require('../core/mail');

router.post('/', async (req, res) => {
    try {
        await createEmployee(req.body);
        res.status(201).send("Successfully added new employee");
    } catch(err) {
        res.status(500).send(`Failed while trying to add new employee. ${err.message}`);
    }
});

router
    .route('/:employeeNumber')
        .get(async (req, res) => {
            try {
                const employeeData = await getEmployee(req.params.employeeNumber);
                res.status(200).send(employeeData);
            } catch(err) {
                res.status(500).send(`Failed while trying to get employee data. ${err.message}`);
            }
        })
        .delete(async (req,res) => {
            try {
                await removeEmployee(req.params.employeeNumber);
                res.status(200).send("Employee deleted successfully");
            } catch(err) {
                res.status(500).send(`Failed while trying to delete employee. ${err.message}`);
            }
        });

router.post("/:employeeNumber/corona", async (req, res) => {
    const dateRange = moment().subtract('days', 7).format('MM-DD-YYYY 00:00');

    try {
        await updateEmployee(req.params.employeeNumber, {isSick: true});
        const employeesEmails = await getExposedEmployeesEmails(req.params.employeeNumber, dateRange);
        if(employeesEmails.length > 0) {
            // await sendMail(employeesEmails);
            console.log(employeesEmails);
            res.status(200).send("Successfully notified exposed employees");
        } else {
            res.status(200).send(`No employees were exposed to the sick emplyee`);
        }
    } catch(err) {
        res.status(500).send(`Failed while try to notifiy exposed employees. ${err.message}`);
    }
})

module.exports = router;