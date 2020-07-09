const WorklogsModal = require("../db/models/worklogs");

const addWorklog = (employeeNumber, worklogType) => {
    return WorklogsModal.create({Type: worklogType, employeeNumber})
}

const getWorklog = (id) => {
    return WorklogsModal.findById(id);
}

const removeWorklog = (id) => {
    return WorklogsModal.remove(id);
}

const getExposedEmployeesEmails = async (employeeNumber, dateRange) => {
    const sickEmployeeWorkLogs = await WorklogsModal.find({employeeNumber, createdAt: {$gte: new Date(dateRange)}}).sort({createdAt: 1});

    const sickEmployeeTimesRange = timesRange(sickEmployeeWorkLogs); // [{start:,end:}, {start:,end:}]
    
    const restEmployeesEmails = await WorklogsModal.aggregate([
        {
            $match: {
                employeeNumber: 
                    {
                        $ne: employeeNumber
                    },
                $or: sickEmployeeTimesRange.map(time =>({createdAt: {$gte: new Date(time.start), $lt: new Date(time.end)}})),
            }
        },
        {
            $group: {
                _id: '$employeeNumber',
                employeeNumber: {$first: '$employeeNumber'}
            }
        },
        {
            $lookup: {
                from: 'employees',
                localField: 'employeeNumber',
                foreignField: 'employeeNumber',
                as: 'employee'
            }
        },
        {
            $unwind: {
                path: '$employee',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: 1,
                emails: {$push: '$employee.email'}
            }
        }
    ]);

    return restEmployeesEmails[0].emails;
}


const timesRange = (worklogs) => {
    const daysLogs = [];
    worklogs.forEach((worklog, index) => {
        if(index % 2 === 0) {
            daysLogs.push({start: worklog.createdAt})
        } else {
            daysLogs[daysLogs.length - 1] = {...daysLogs[daysLogs.length - 1], end: worklog.createdAt}
        }
    });

    return daysLogs;
}

module.exports = {
    addWorklog,
    removeWorklog,
    getWorklog,
    getExposedEmployeesEmails
}