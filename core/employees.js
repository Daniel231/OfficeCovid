const EmployeeModal = require("../db/models/Employee");

const createEmployee = ({firstName, lastName, email, employeeNumber}) => {
    return EmployeeModal.create({firstName, lastName, email, employeeNumber});
}

const getEmployee = (employeeNumber) => {
    return EmployeeModal.findOne({employeeNumber});
}

const removeEmployee = (employeeNumber) => {
    return EmployeeModal.update({employeeNumber}, {isDeleted: true});
}

const updateEmployee = (employeeNumber, data) => {
    return EmployeeModal.findOneAndUpdate({employeeNumber}, data)
}

module.exports = {
    createEmployee,
    getEmployee,
    removeEmployee,
    updateEmployee
}