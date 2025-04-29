const {hash, compare} = require('bcryptjs');
const {createHmac} = require('crypto');

exports.doHash = (value, saltValue) => {
    const result = hash(value, saltValue);
    return result;
}

exports.compareHash = (value, hashedValue) => {
    const result = compare(value, hashedValue);
    return result;
}

exports.hmacProcess = (value, secret) => {
    const result = createHmac('sha256', secret)
        .update(value)
        .digest('hex');
    return result;
}