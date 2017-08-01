'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Wrap methods in wappedMethod(...args, cb) => method(args, cb), so:
// If method(...args) returns a promise, follow it
// If it returns a another value, automagically cb(it)
// And if it doesn't return, assume it called cb in its own
function Chaintastic() {
    for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
        objects[_key] = arguments[_key];
    }

    var object = Object.assign.apply(Object, objects);
    var methods = {};

    Object.getOwnPropertyNames(object).forEach(function (method) {
        var func = object[method];

        methods[method] = function () {
            var _object$method;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            var cb = args.pop();
            var result = typeof func === 'function' ? (_object$method = object[method]).call.apply(_object$method, [methods].concat(args, [cb])) : func;

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
Chaintastic.chain = function (methods) {
    var promise = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Promise.resolve();

    var chain = {};

    Object.getOwnPropertyNames(methods).forEach(function (method) {
        chain[method] = function () {
            for (var _len3 = arguments.length, methodArgs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                methodArgs[_key3] = arguments[_key3];
            }

            var newPromise = promise.then(function (prevPromiseResult) {
                return new Promise(function (resolve) {
                    var args = prevPromiseResult ? prevPromiseResult.filter(function (a) {
                        return a !== undefined;
                    }).concat(methodArgs) : methodArgs;

                    methods[method].apply(methods, _toConsumableArray(args).concat([function () {
                        for (var _len4 = arguments.length, result = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                            result[_key4] = arguments[_key4];
                        }

                        return resolve(result);
                    }]));
                });
            });

            return Chaintastic.chain(methods, newPromise);
        };
    });

    chain.init = function () {
        for (var _len5 = arguments.length, value = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            value[_key5] = arguments[_key5];
        }

        return Chaintastic.chain(methods, Promise.resolve(value));
    };
    chain.then = function (cb) {
        return promise.then(function (lastResult) {
            return cb.apply(undefined, _toConsumableArray(lastResult));
        });
    };

    return chain;
};

if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
    module.exports = Chaintastic;
}
