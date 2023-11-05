const Role = require('../models/Role');

const roleCheck = (roleName) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res.status(400).send({ error: `Role ${roleName} does not exist.` });
      }

      if (!req.account.roleId.equals(role._id)) {
        return res.status(403).send({ error: 'Permission denied.' });
      }

      next();
    } catch (error) {
      res.status(401).send({ error: 'Not authorized to access this resource' });
    }
  };
};

module.exports = roleCheck;
