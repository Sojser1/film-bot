const errorHandler = function errorHandler(ctx, customMessage, error) {
    ctx.reply(customMessage);
    if (error) {
        console.log(error.message)
    }
}

module.exports.errorHandler = errorHandler;