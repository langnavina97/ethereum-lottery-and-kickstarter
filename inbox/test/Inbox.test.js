const assert = require('assert');
const ganache = require('ganache-cli');

/*   upper case because Web3 is a constructor function   */
const Web3 = require('web3');

/*   ganache automatically creates a list of unlocked accounts   */
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = "Hi there!"

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [INITIAL_STRING]})
        .send({from: accounts[0], gas: '1000000'});
});


describe('Inbox', () => {
    it('deploy a contract', () => {
        assert.ok(inbox.options.address)
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('Bye there!').send({from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Bye there!');
    })
});

/*

*** Example on how testing in general works

class Car {
    park() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

let car;

beforeEach(() => {
    car = new Car();
})


describe('Car Class', () => {
    it('can park', () => {
        assert.equal(car.park(), 'stopped');
    });

    it('can drive', () => {
        assert.equal(car.drive(), 'vroom');
    });
})

*/