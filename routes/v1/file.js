const express = require('express');
const router = express.Router();
const FileController = require('../../controllers/file')

router.get("/file/:id", FileController._getFile);

router.post("/file", FileController._createFile);

module.exports = router;