exports.init = function(options) {

    if (typeof options === 'undefined' || options === null) {
        throw new Error('You have to add some option');
    }

    return require('./lib')(options);

}
