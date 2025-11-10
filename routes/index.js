var express = require("express");
var router = express.Router();
const fs = require("fs").promises;
const { readDB } = require("../middleware/readDB");
const { schema } = require("../validation/all");
const bcryptjs = require("bcryptjs");
const { createPath } = require("../middleware/createpath");

/* GET home page. */
router.get("/", readDB, function (req, res, next) {
  const { users } = res.locals;
  res.render("index", { users });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", readDB, async (req, res) => {
  try {
    const { name, email, password } = await schema.validateAsync(req.body);
    const { users } = res.locals;
    const valbody = await schema.validateAsync(req.body);

    // 🔒 Գաղտնաբառի hash
    const hashed = await bcryptjs.hash(password, 10);

    // ⚠️ Ստուգում՝ արդյոք email-ը արդեն գրանցված ա
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(404).json({
        message: "Այս email-ով օգտատեր արդեն գոյություն ունի",
      });
    }

    // 👤 Նոր user օբյեկտ
    const newUser = { id: Date.now(), name, email, password: hashed };
    users.push(newUser);

    // 🗂 Գրում ենք users.json-ի մեջ
    await fs.writeFile(
      createPath("db", "users.json"),
      JSON.stringify(users, null, 2)
    );

    res.json({ message: "✅ Registered successfully", user: newUser });
  } catch (error) {
    res.json({ message: "Register failed", error });
  }
});

router.post("/login", readDB, async (req, res) => {
  try {
    const { email, password } = req.body;
    const { users } = res.locals;
    const user = users.find((u) => u.email === email);
    if (!user) return res.json({ message: "User  Not Found" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.json({ message: "Invalid Password" });

    res.json({ message: "Logged in successfully", user });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
