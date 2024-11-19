"use strict";
var _a;
exports.__esModule = true;
exports.auth = exports.signOut = exports.signIn = exports.handlers = void 0;
var next_auth_1 = require("next-auth");
var google_1 = require("next-auth/providers/google");
exports.handlers = (_a = next_auth_1["default"]({
    providers: [google_1["default"]]
}), _a.handlers), exports.signIn = _a.signIn, exports.signOut = _a.signOut, exports.auth = _a.auth;
