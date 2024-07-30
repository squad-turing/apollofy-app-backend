"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const track_routes_1 = __importDefault(require("./routes/track.routes"));
const body_parser_1 = require("body-parser");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const genre_routes_1 = __importDefault(require("./routes/genre.routes"));
const playlist_routes_1 = __importDefault(require("./routes/playlist.routes"));
const artists_routes_1 = __importDefault(require("./routes/artists.routes"));
const album_routes_1 = __importDefault(require("./routes/album.routes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const checkjwt_middlewares_1 = require("./middlewares/checkjwt.middlewares");
const error_midleware_1 = __importDefault(require("./middlewares/error.midleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//middlewares
app.use((0, cors_1.default)({ origin: process.env.APP_ORIGIN, credentials: true }));
app.use(express_1.default.json());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.use((0, express_fileupload_1.default)({ useTempFiles: true, tempFileDir: "./upload" }));
//routes
app.use("/user", checkjwt_middlewares_1.checkJwtMiddleware, user_routes_1.default);
app.use("/track", checkjwt_middlewares_1.checkJwtMiddleware, track_routes_1.default);
app.use("/genre", checkjwt_middlewares_1.checkJwtMiddleware, genre_routes_1.default);
app.use("/playlist", checkjwt_middlewares_1.checkJwtMiddleware, playlist_routes_1.default);
app.use("/artist", checkjwt_middlewares_1.checkJwtMiddleware, artists_routes_1.default);
app.use("/album", checkjwt_middlewares_1.checkJwtMiddleware, album_routes_1.default);
app.use(error_midleware_1.default);
// app.get("/", (req: Request, res: Response) => {
//   res.status(200).json({
//     msg: "Welcome to Apollofy API.",
//   });
// });
exports.default = app;
