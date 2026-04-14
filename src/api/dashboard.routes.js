const express = require("express");
const { getResumes } = require("../controllers/dashboard.controller");

function dashboardRoutes() {
    const router = express.Router();

    router.get("/", getResumes);

    return router;
}

module.exports = { dashboardRoutes };
