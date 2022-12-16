const usersRoutes = require('./users');
const eventRoutes = require('./events');
const likesRoutes = require('./likes');
const reportsRoutes = require('./reports');
const followersRoutes = require('./followers');
const profileRoutes = require('./userProfile')
const commentRoutes = require('./comments');
const adminRoutes = require('./admin');
const searchRoutes = require('./search');

const constructorMethod = (app) => {
  app.use('/', usersRoutes);
  app.use('/events',eventRoutes);
  app.use('/comments', commentRoutes);
  app.use('/likes',likesRoutes);
  app.use('/reports',reportsRoutes);
  app.use('/followers',followersRoutes);
  app.use('/profile', profileRoutes);
  app.use('/admin', adminRoutes);
  app.use('/search', searchRoutes);
  
  app.use('*', (req, res) => {
    res.status(404).json('Page Not found');
  });
    
};

module.exports = constructorMethod;