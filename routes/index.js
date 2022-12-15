const usersRoutes = require('./users');
const commentRoutes = require('./comments');
const profileRoutes = require('./userProfile')


const constructorMethod = (app) => {
    app.use('/', usersRoutes);
    app.use('/comments', commentRoutes);
    app.use('/', profileRoutes)
    app.use('*', (req, res) => {
        res.status(404).json('Page Not found');
    });

};

module.exports = constructorMethod;