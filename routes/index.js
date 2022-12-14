const usersRoutes = require('./users');
const commentRoutes = require('./comments');
const eventRoutes = require('./events');

const constructorMethod = (app) => {
  app.use('/', usersRoutes);
  app.use('/events',eventRoutes),
  app.use('/comments', commentRoutes);
  app.use('*', (req, res) => {
    res.status(404).json('Page Not found');
  });
    
};
  
module.exports = constructorMethod;