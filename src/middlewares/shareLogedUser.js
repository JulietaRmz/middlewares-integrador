//----------* MIDDLEWARE *----------//
module.exports = (req, res, next) => {
    res.locals.logedUser = false;
    if (req.session.user) {
        res.locals.logedUser = req.session.user;
    }
    return next();
}