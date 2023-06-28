const CategoriesController = require("./controllers/categories/Categories");
const HomeController = require("./controllers/home/Home");
const ArticlesController = require("./controllers/articles/Articles");
const LoginController = require("./controllers/user/User");
const {app} = require("./src/app");


app.use("/", CategoriesController)
app.use("/", HomeController);
app.use("/", ArticlesController);
app.use("/", LoginController);

