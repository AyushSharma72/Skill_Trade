function isAdmin(req, resp, next) {
  try {
    const { role } = req.body;
    const { role: roleFromFields } = req.fields || {}; // declare first!

    if (Number(role || roleFromFields) === 2) {
      next();
    } else {
      return resp.status(401).send({
        message: "Unauthorized Access",
        success: false,
      });
    }
  } catch (error) {
    return resp.status(500).send({
      message: "internal server error",
      success: false,
    });
  }
}


module.exports = isAdmin;