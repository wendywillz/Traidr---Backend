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
const changePassword_1 = __importDefault(require("./routes/changePassword"));
const otpRoute_1 = __importDefault(require("./routes/otpRoute"));
const paymentRoute_1 = __importDefault(require("./routes/paymentRoute"));
dotenv_1.default.config();
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
database_config_1.default.sync()
    .then(() => {
    console.log("Database has been connected");
}).catch((error) => {
    console.log("Error synching the database");
    throw error;
});
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../", 'public')));
app.use('/', index_1.default);
app.use('/users', users_1.default);
app.use('/users-otp', otpRoute_1.default);
app.use('/changePassword', changePassword_1.default);
app.use('/savePayment', paymentRoute_1.default);
exports.default = app;
