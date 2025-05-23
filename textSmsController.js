const express = require("express");
const router = express.Router();
const smsService = require("./textSmsService");

/**
 * 
 */
router.post("/send", async (req, res) => {
  const { mobile, message } = req.body;
  res.json(await smsService.sendSms(mobile, message));
});

router.post("/schedule", async (req, res) => {
  const { mobile, message, timeToSend } = req.body;
  res.json(await smsService.scheduleSms(mobile, message, timeToSend));
});

router.post("/bulk", async (req, res) => {
  const { mobileNumbers, message, clientSmsIds } = req.body;
  res.json(await smsService.sendBulkSms(mobileNumbers, message, clientSmsIds));
});

router.get("/dlr/:messageId", async (req, res) => {
  res.json(await smsService.getDeliveryReport(req.params.messageId));
});

router.get("/balance", async (req, res) => {
  res.json(await smsService.getAccountBalance());
});

module.exports = router;
