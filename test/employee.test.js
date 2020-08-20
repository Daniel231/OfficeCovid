/**
 * This module include all the the unit testing for the employee.js file in core folder
 * 
 * @author Daniel231
 */

const { createEmployee,
        getEmployee,
        removeEmployee,
        updateEmployee } = require("../core/employees");
const Employee = require("../db/models/Employee");
const {connect, disconnect} = require("../db");

describe("The Employee core functions", () => {

    let dummyEmployee;

    /**
     * Connecting to db and intializing the db to make sure the db is empty for tests.
     */
    beforeAll(async () => {
        await connect();
        await Employee.deleteMany({});
        dummyEmployee = {
            firstName: "Daniel",
            lastName: "Ezra",
            email: "danielezra10@gmail.com",
            employeeNumber: "1234"
        }

        await Employee.create(dummyEmployee);
    });

    /**
     * The test creating new user and saving him to db and after that making sure he really did created.
     */
    test("Should create new employee", async () => {
        const testEmployee = {
            firstName: "Yoni",
            lastName: "Demilo",
            email: "Yno@gmail.com",
            employeeNumber: 1111
        }

        const newEmployee = await createEmployee(testEmployee);

        const isEmployeeCreated = await Employee.exists({_id: newEmployee.id});

        expect(isEmployeeCreated).toBeTruthy();
    })

    /**
     * The test should try to create same user and fail cause of duplicate data
     */
    test("Should fail while trying to create new user that already exists/have same uniqe data in db already", async () => {
        const duplicateUser = {
            firstName: "Daniel",
            lastName: "Ezra",
            email: "danielezra10@gmail.com",
            employeeNumber: "1234"
        }

        await expect(createEmployee(duplicateUser)).rejects.toThrow(/duplicate/);
    });

    /**
     * The test should fetch exists user data from db
     */
    test("Should receive user data from db", async () => {
        const userData = await getEmployee(dummyEmployee.employeeNumber);

        expect(userData.employeeNumber).toMatch(dummyEmployee.employeeNumber)
    })

    /**
     * The test trying to fetch a data of user that not exists
     */
    test("Should try to fetch not existing user data and fail", async () => {
        const fakeUser = {
            firstName: "fake",
            lastName: "user",
            email: "notExists@gmail.com",
            employeeNumber: "0000"
        }

        const notExistsUser = await getEmployee(fakeUser.employeeNumber);

        expect(notExistsUser).toBeNull();
    })

    /**
     * The test removing user from the db and then check if he still exists or not
     */
    test("Should delete user from the db", async() => {

        // Creating user we want to delete and insert him directly to the db woth mongoose
        const testUser = {
            firstName: "test",
            lastName: "user",
            email: "testuser@gmail.com",
            employeeNumber: "0000"
        }
        await Employee.create(testUser);

        // Invoking the removing function we want to test and getting the updated data from the db
        await removeEmployee(testUser.employeeNumber);
        const EmployeeData = await Employee.findOne({employeeNumber: testUser.employeeNumber});

        // Checking that the employee deleted
        expect(EmployeeData.isDeleted).toBeTruthy();
    })

    /**
     * The test updating data for employee and then check in the db if the data updated correctly
     */
    test("Should update employee data", async() => {

        // Updating the employee data with our function
        await updateEmployee(dummyEmployee.employeeNumber, {firstName: "Yakov"});

        // Getting the user data directly from the db
        const updatedUserdata = await Employee.findOne({employeeNumber: dummyEmployee.employeeNumber});

        expect(updatedUserdata.firstName).toMatch("Yakov");
    });

    /**
     * The test checks what happend when trying to update employee that doesnt exists
     */
    test("Should fail while trying to update unexists employee", async() => {

        // Trying to Updat the unexists employee data
        const notExistsUser = await updateEmployee("8888", {firstName: "Yakov"});

        expect(notExistsUser).toBeNull();
    });

    /**
     * Closing connection to mongo server.
     */
    afterAll(async () => {
        await disconnect();
    })
})