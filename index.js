"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("./routes/route"));
const app = (0, express_1.default)();
const port = 3000;
mongoose_1.default.connect('mongodb+srv://muhammednehyan9895:I915et0f1j@cluster0.ybzp1dx.mongodb.net/Connect');
app.use('/uploads', express_1.default.static('uploads'));
app.use(express_1.default.json());
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/', route_1.default);
app.get('/', (req, res) => res.send('Hello World! Nice to meet you br0000.Im heree'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
