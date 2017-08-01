const Chaintastic = require('../lib/chaintastic');
const chainedMath = Chaintastic(Math);

chainedMath
    .init(18)
    .log()
    .then(console.log)

chainedMath
    .PI()
    .round()
    .pow(2)
    .then(console.log);
