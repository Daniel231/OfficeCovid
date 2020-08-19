const Employee = require("../db/models/Employee");
const {connect, disconnect} = require("../db");

describe("The Employee model", () => {

    /**
     * Connecting to db and intializing the db to make sure the db is empty for tests.
     */
    beforeAll(async () => {
        await connect();
        await Employee.deleteMany({});
    });

    /**
     * The test creating new user and saving him to db and after that making sure he really did created.
     */
    test("Should create new employee", async () => {
        const testEmployee = {
            firstName: "Daniel",
            lastName: "Ezra",
            email: "danielezra10@gmail.com",
            employeeNumber: 1234
        }

        const newEmployee = await Employee.create(testEmployee);

        expect(newEmployee).not.toBeNull();
    })

    /**
     * Closing connection to mongo server.
     */
    afterAll(async () => {
        await disconnect();
    })
})