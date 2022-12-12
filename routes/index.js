const usersRoutes = require('./users');
const commentRoutes = require('./comments');
const likesRoutes = require('./likes');
const reportsRoutes = require('./reports');
const followersRoutes = require('./followers');

const constructorMethod = (app) => {
  app.use('/', usersRoutes);
  app.use('/comments', commentRoutes);
  app.use('/likes',likesRoutes);
  app.use('/reports',reportsRoutes);
  app.use('/followers',followersRoutes);
  app.use('*', (req, res) => {
    res.status(404).json('Page Not found');
  });
    
};
  
module.exports = constructorMethod;