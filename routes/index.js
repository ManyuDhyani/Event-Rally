const usersRoutes = require('./users');
const commentRoutes = require('./comments');


const constructorMethod = (app) => {
  app.use('/', usersRoutes);
  app.use('/comments', commentRoutes);
  app.use('*', (req, res) => {
    res.status(404).json('Page Not found');
  });
    
};
  
module.exports = constructorMethod;