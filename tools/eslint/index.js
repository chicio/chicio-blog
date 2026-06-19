// @ts-check
"use strict";

const preferComponentStore = require("./rules/prefer-component-store");
const storeReturnShape = require("./rules/store-return-shape");
const indexOnlyComponent = require("./rules/index-only-component");
const folderComposition = require("./rules/folder-composition");

/** @type {import("eslint").ESLint.Plugin} */
const plugin = {
    rules: {
        "prefer-component-store": preferComponentStore,
        "store-return-shape": storeReturnShape,
        "index-only-component": indexOnlyComponent,
        "folder-composition": folderComposition,
    },
};

module.exports = plugin;
