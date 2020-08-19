const express = require('express');
const router = express.Router();
const { addWorklog, removeWorklog, getWorklog, getEmployeeWorklogs } = require('../core/worklogs');
const { getEmployee } = require('../core/employees');

router.get('/:logId', async (req, res) => {
    try {
        const worklogData = await getWorklog(req.params.logId);
        res.status(200).send(worklogData);
    } catch(err) {
        res.status(500).send(`Failed while trying to get worklog info. ${err.message}`);
    }
});

router.get('/employees/:employeeNumber', async (req, res) => {
    try {
        const employeeData = await getEmployeeWorklogs(req.params.employeeNumber);
        res.status(200).send(employeeData);
    } catch(err) {
        res.status(500).send(`Failed while trying to add new employee. ${err.message}`);
    }
});

router
    .route('/:employeeNumber')
        .post(async (req, res) => {
            const employeeNumber = req.params.employeeNumber;
            const {worklogType} = req.body;

            try {
                const employee = await getEmployee(employeeNumber);

                if(employee) {
                    if(employee.isSick && worklogType === "Arrived") {
                        res.status(400).send("Employee is sick!! send him/her home!!");
                    } else {
                        await addWorklog(employeeNumber, worklogType);
                        res.status(201).send("Successfully added new work log");
                    }
                } else {
                    res.status(404).send("Wrong employee number, employee doesnt exists!");
                }
            } catch(err) {
                res.status(500).send(`Failed while trying to add new worklog. ${err.message}`);
            }
        })
        .delete(async (req,res) => {
            try {
                await removeWorklog(req.params.employeeNumber);
                res.status(200).send("Work log deleted successfully");
            } catch(err) {
                res.status(500).send(`Failed while trying to delete work log data. ${err.message}`);
            }
        });

module.exports = router;