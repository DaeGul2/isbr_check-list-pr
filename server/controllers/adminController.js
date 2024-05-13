// adminController.js
const adminController = {
    authenticateAdmin: (req, res) => {
      const { code, password } = req.body;
      if (code === "isbr" && password === '8067') {
        req.session.isAdmin = true;
        res.send({ isAdmin: true });
      } else {
        req.session.isAdmin = false;
        res.send({ isAdmin: false });
      }
    },
  
    checkAdminStatus: (req, res) => {
      res.send({ isAdmin: req.session.isAdmin || false });
    }
  };
  
  module.exports = adminController;
  