

const constructorMethod = (app) => {


    app.use('*', (req, res) => {
      res.status(404).json('Page Not found');
    });
    
};
  
module.exports = constructorMethod;