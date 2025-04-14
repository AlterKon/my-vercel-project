const authService = require('../../services/authService');

const RegisterPage = (req, res) => {
    res.render("public/register", { error: null });
}

const CheckNewAccount = async (req, res) => {
  const { username, email, password } = req.body;

  try {
      const result = await authService.registerUser(username, email, password);

      if (!result.success) {
          return res.render("public/register", { error: result.message });
      }

      res.redirect("/login");
  } catch (err) {
      console.error("Lỗi khi đăng ký:", err);
      res.status(500).send("Lỗi máy chủ");
  }
};
module.exports ={
    RegisterPage, CheckNewAccount
}