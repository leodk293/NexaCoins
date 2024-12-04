"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.postsTable = exports.usersTable = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.usersTable = sqlite_core_1.sqliteTable("users", {
    id: sqlite_core_1.integer("id").primaryKey(),
    name: sqlite_core_1.text("name").notNull(),
    email: sqlite_core_1.text("email").unique().notNull()
});
exports.postsTable = sqlite_core_1.sqliteTable("posts", {
    id: sqlite_core_1.integer("id").primaryKey(),
    name: sqlite_core_1.text("name").notNull(),
    email: sqlite_core_1.text("email").notNull(),
    content: sqlite_core_1.text("content").notNull(),
    userId: sqlite_core_1.integer("user_id")
        .notNull()
        .references(function () { return exports.usersTable.email; }, { onDelete: "cascade" }),
    createdAt: sqlite_core_1.text("created_at")["default"](drizzle_orm_1.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"]))))
        .notNull()
});
var templateObject_1;
