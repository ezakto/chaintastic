const Chaintastic = require('../lib/chaintastic');

const chain = Chaintastic({
    generateNumber() {
        return Math.random() * 10;
    },

    floor(number) {
        return Math.floor(number);
    },

    pow(a, b) {
        return Math.pow(a, b);
    },

    wait(value, time, cb) {
        setTimeout(() => cb(value), time);
    },

    print(value) {
        console.log('Current value:', value);
        return value;
    }
});

chain
    .generateNumber()
    .print()
    .wait(2000)
    .floor()
    .print()
    .wait(2000)
    .pow(2)
    .print();
