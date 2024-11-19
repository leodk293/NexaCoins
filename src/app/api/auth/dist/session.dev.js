"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = handler;

var _auth = require("../../auth");

// pages/api/auth/session.js
function handler(req, res) {
  var session;
  return regeneratorRuntime.async(function handler$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _auth.auth)());

        case 3:
          session = _context.sent;
          console.log("Session data:", session); // Log session data to verify

          res.status(200).json({
            session: session
          });
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Session retrieval error:", _context.t0);
          res.status(500).json({
            error: "Failed to retrieve session."
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}