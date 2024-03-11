"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const database_config_1 = __importDefault(require("./database/database.config"));
const dotenv_1 = __importDefault(require("dotenv"));
const otpRoute_1 = __importDefault(require("./routes/otpRoute"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const verifyToken_1 = __importDefault(require("./routes/verifyToken"));
const shopRoutes_1 = __importDefault(require("./routes/shopRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
dotenv_1.default.config();
database_config_1.default.sync()
    .then(() => {
    console.log("Database has been connected");
}).catch((error) => {
    console.log("Error syncing the database");
    throw error;
});
const FRONTEND_URL = process.env.FRONTEND_URL;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../", 'public')));
app.use('/', index_1.default);
app.use('/users', users_1.default);
app.use('/verify-token', verifyToken_1.default);
app.use('/users-otp', otpRoute_1.default);
app.use('/shop', shopRoutes_1.default);
app.use('/notification', notificationRoutes_1.default);
app.use('/products', productRoutes_1.default);
exports.default = app;
