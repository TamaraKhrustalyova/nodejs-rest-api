const handleSaveError = (error, data, next) => {
    error.status = 400;
    next();
}

const runValidationAtUpdate = function(next) {
    this.options.runValidators = true;
    this.options.new = true;
    next();
}
    
module.exports = {
   handleSaveError, 
   runValidationAtUpdate,
}