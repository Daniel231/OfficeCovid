/**
 * This module include all the the unit testing for the employee.js file in core folder
 * 
 * @author Daniel231
 */

const { createEmployee,
        getEmployee,
        removeEmployee,
        updateEmployee } = require("../../core/employees");
const Employee = require("../../db/models/Employee");
const {connect, disconnect} = require("../../db");

describe("The Employee core functions", () => {

    let dummyEmployee;

    /**
     * Connecting to db intializing it by makeing sure the db is empty for tests and creating basic employee for testing.
     */
    beforeAll(async () => {
        // Connecting to mongodb
        await connect();

        // Removing all employees data to initialize the db.
        await Employee.deleteMany({});

        // Creating and adding basic employee for the testing cases
        dummyEmployee = {
            firstName: "Daniel",
            lastName: "Ezra",
            email: "danielezra10@gmail.com",
            employeeNumber: "1234"
        }

        await Employee.create(dummyEmployee);
    });

    /**
     * The test creating new emplyee and saving him to db and after that making sure he really did created.
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
     * This test trying to create empty emplyee and should fail
     */
         test("Should fail while trying to create empty emplyee", async() => {
         // The empty employee data
         const emptyEmployee = {};

         // Trying to create the empty employee and excpect the action to fail
         await expect(createEmployee(emptyEmployee)).rejects.toThrow(/Employee validation failed/);
     })

     /**
      * This test checks if the function validate that a created employee have first name
      */
     test("Should fail when trying to create employee without first name", async() => {
         // The emplyee data without fiest name
         const employee = {
            lastName: "Bello",
            email: "lthefirst@gmail.com",
            employeeNumber: 8888
         }

         try {
            // Creating the employee without first name field
            await createEmployee(employee);    
         } catch(error) {
            // Expect the employee creating to fail and catch the error
            expect(error.message).toBe(`Employee validation failed: firstName: employee first name can't be blank`);
         }
    })

    /**
     * This test case checks if the emplyee creating function validate that a new employee have last name
     */

    /**
     * This test case checks if the employee creating function validate that a new employee have email address
     */

    /**
     * This test case checks if the employee creating function validate that a new employee have employee number
     */

    /**
     * This test case checks if the employee creating function validate that a new employee have valid email address
     */

    /**
     * This test case checks if the employee creating function validate that a new emplyee have valid first name - only letters
     */

    /**
     * This test case checks if the employee creating function validate that a new emplyee have valid first name - at least three letters
     */

    /**
     * This test case checks if the employee creating function validate that a new emplyee have valid last name - at least three letters
     */

    /**
     * This test case checks if the employee creating function validate that a new emplyee have valid last name - only letters
     */

    /**
     * This test case checks if the employee creating function validate that a new emplyee have valid employee number - at least four digits
     */

    /**
     * This test case checks if the employee creating function validate that a new emplyee have valid employee number - only numbers
     */

    /**
     * The test should try to create same emplyee and fail cause of duplicate data
     */
    test("Should fail while trying to create new emplyee that already exists/have same unique data in db already", async () => {
        const duplicateEmployee = {
            firstName: "Daniel",
            lastName: "Ezra",
            email: "danielezra10@gmail.com",
            employeeNumber: "1234"
        }

        await expect(createEmployee(duplicateEmployee)).rejects.toThrow(/duplicate/);
    });

    /**
     * This test case checks what happend when trying to create employee with extra fields (like phone number).
     */

    /**
     * The test should fetch exists emplyee data from db
     */
    test("Should receive emplyee data from db", async () => {
        const emplyeeData = await getEmployee(dummyEmployee.employeeNumber);

        expect(emplyeeData.employeeNumber).toMatch(dummyEmployee.employeeNumber)
    })

    /**
     * The test trying to fetch a data of emplyee that not exists
     */
    test("Should try to fetch not existing emplyee data and fail", async () => {
        const fakeEmployee = {
            firstName: "fake",
            lastName: "emplyee",
            email: "notExists@gmail.com",
            employeeNumber: "0000"
        }

        const notExistsEmployee = await getEmployee(fakeEmployee.employeeNumber);

        expect(notExistsEmployee).toBeNull();
    })

    /**
     * This test case checks what happend when trying to fetch emplyee data with invalid employee number
     */

    /**
     * The test removing emplyee from the db and then check if he still exists or not
     */
    test("Should delete emplyee from the db", async() => {

        // Creating emplyee we want to delete and insert him directly to the db woth mongoose
        const testEmployee = {
            firstName: "test",
            lastName: "emplyee",
            email: "testemplyee@gmail.com",
            employeeNumber: "0000"
        }
        await Employee.create(testEmployee);

        // Invoking the removing function we want to test and getting the updated data from the db
        await removeEmployee(testEmployee.employeeNumber);
        const EmployeeData = await Employee.findOne({employeeNumber: testEmployee.employeeNumber});

        // Checking that the employee deleted
        expect(EmployeeData.isDeleted).toBeTruthy();
    })

    /**
     * This test checks what happend when trying to remove unexisting emplyee
     */

    /**
     * This test case checks what happend when trying to remove emplyee with invalid employee number
     */
    
    /**
     * This test case checks what happend when calling the delete employee function without emplyee number
     */

    /**
     * The test updating data for employee and then check in the db if the data updated correctly
     */
    test("Should update employee data", async() => {

        // Updating the employee data with our function
        await updateEmployee(dummyEmployee.employeeNumber, {firstName: "Yakov"});

        // Getting the emplyee data directly from the db
        const updatedEmployeedata = await Employee.findOne({employeeNumber: dummyEmployee.employeeNumber});

        expect(updatedEmployeedata.firstName).toMatch("Yakov");
    });

    /**
     * The test checks what happend when trying to update employee that doesnt exists
     */
    test("Should fail while trying to update unexists employee", async() => {

        // Trying to Update the unexists employee data
        const notExistsEmployee = await updateEmployee("8888", {firstName: "Yakov"});

        expect(notExistsEmployee).toBeNull();
    });

    /**
     * Closing the connection to mongo server.
     */
    afterAll(async () => {
        await disconnect();
    })
})