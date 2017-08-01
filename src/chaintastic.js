// Wrap methods in wappedMethod(...args, cb) => method(args, cb), so:
// If method(...args) returns a promise, follow it
// If it returns a another value, automagically cb(it)
// And if it doesn't return, assume it called cb in its own
function Chaintastic(...objects) {
    const object = Object.assign.apply(Object, objects);
    const methods = {};

    Object.getOwnPropertyNames(object).forEach(method => {
        const func = object[method];

        methods[method] = (...args) => {
            const cb = args.pop();
            const result = typeof func === 'function'
                ? object[method].call(methods, ...args, cb)
                : func;

            if (result !== undefined && typeof result.then === 'function') {
                return result.then(cb);
            }

            if (result !== undefined) {
                cb(result);
            }
        };
    });

    return Chaintastic.chain(methods);
}

// Given a method collection, this will wrap every method in a promise creator that
// will follow the same promise chain and return a new set of wrapped methods that'll
// be called with the latest resolved value, and so on, until .then() is called.
Chaintastic.chain = (methods, promise = Promise.resolve()) => {
    const chain = {};

    Object.getOwnPropertyNames(methods).forEach(method => {
        chain[method] = (...methodArgs) => {
            const newPromise = promise.then((prevPromiseResult) => new Promise(resolve => {
                const args = prevPromiseResult
                    ? prevPromiseResult.filter(a => a !== undefined).concat(methodArgs)
                    : methodArgs;

                methods[method](...args, (...result) => resolve(result));
            }));

            return Chaintastic.chain(methods, newPromise);
        }
    });

    chain.init = (...value) => Chaintastic.chain(methods, Promise.resolve(value));
    chain.then = cb => promise.then(lastResult => cb(...lastResult));

    return chain;
}

if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
    module.exports = Chaintastic;
}
