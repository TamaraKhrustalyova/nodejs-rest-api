const {HttpError} = require('../helpers/index');

const validateBody = (req, res, next) => {
    if(!Object.keys(req.body).length) {
        return next (HttpError(400, 'missing fields'));
    }
}

module.exports = validateBody;