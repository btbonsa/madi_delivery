const express = require("express");

const router = express.Router();
const requests = require("../Controllers/requestController");

router.get("/requests", requests.requests.bind(requests));
router.post("/requests", requests.createRequests.bind(requests));

module.exports = router;
