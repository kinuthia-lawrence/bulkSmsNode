require("dotenv").config();
const axios = require("axios");

const {
  TEXTSMS_API_KEY,
  TEXTSMS_PARTNER_ID,
  TEXTSMS_SENDER_ID,
  TEXTSMS_POST_URL,
  TEXTSMS_BULK_URL,
  TEXTSMS_DLR_URL,
  TEXTSMS_BALANCE_URL,
} = process.env;

//* Format the mobile number to the correct format
//* 2547XXXXXXXX
function formatMobileNumber(mobile) {
  if (mobile.startsWith("+")) mobile.substring(1);
  if (mobile.startsWith("0")) mobile = "254" + mobile.substring(1);
  if (mobile.length <= 10) mobile = "254" + mobile;
  return mobile;
}

/** Send a single SMS
 * @param {string} mobile - The mobile number to send the SMS to
 * @param {string} message - The message to send
 * @returns {Promise<object>} - The response from the SMS API
 */
async function sendSingleSms(mobile, message) {
  try {
    const data = {
      apikey: TEXTSMS_API_KEY,
      partnerID: TEXTSMS_PARTNER_ID,
      message: message,
      shortcode: TEXTSMS_SENDER_ID,
      mobile: formatMobileNumber(mobile),
    };
    const res = await axios.post(TEXTSMS_POST_URL, data);
    return res.data;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return {
      "response-code": e.response?.data?.["response-code"] || "9999",
      "response-description":
        e.response?.data?.["response-description"] ||
        "Error: Unable to send SMS",
    };
  }
}

/**
 * Send a bulk SMS
 * @param {string[]} mobiles - The mobile numbers to send the SMS to
 * @param {string} message - The message to send
 * @returns {Promise<object>} - The response from the SMS API
 */
async function scheduleSms(mobile, message, timeToSend) {
  try {
    const data = {
      apikey: TEXTSMS_API_KEY,
      partnerID: TEXTSMS_PARTNER_ID,
      message: message,
      shortcode: TEXTSMS_SENDER_ID,
      mobile: formatMobileNumber(mobile),
      timeToSend: timeToSend,
    };
    const response = await axios.post(TEXTSMS_POST_URL, data);
    return response.data;
  } catch (e) {
    return {
      "response-code": e.response?.data?.["response-code"] || "9999",
      "response-description":
        e.response?.data?.["response-description"] ||
        "Error: Unable to send SMS",
    };
  }
}

/**
 * Send a bulk SMS
 * @param {string[]} mobiles - The mobile numbers to send the SMS to
 * @param {string} message - The message to send
 * @param {string[]} clientSmsIds - The client SMS IDs
 * @returns {Promise<object>} - The response from the SMS API
 */
async function sendBulkSms(mobiles, message, clientSmsIds) {
  try {
    if (
      mobiles.length !== message.length ||
      mobiles.length !== clientSmsIds.length
    ) {
      throw new Error(
        "The length of mobiles, messages and clientSmsIds must be the same"
      );
    }
    const smsList = mobiles.map((mobile, i) => ({
      partnerID: TEXTSMS_PARTNER_ID,
      apikey: TEXTSMS_API_KEY,
      pass_type: "plain",
      shortcode: TEXTSMS_SENDER_ID,
      mobile: formatMobileNumber(mobile),
      message: message[i],
      clientsmsid: clientSmsIds[i],
    }));
    const data = { count: mobiles.length, smsList };
    const response = await axios.post(TEXTSMS_BULK_URL, data);
    return response.data;
  } catch (e) {
    return {
      "response-code": e.response?.data?.["response-code"] || "9999",
      "response-description":
        e.response?.data?.["response-description"] ||
        "Error: Unable to send bulk SMS",
    };
  }
}
/**
 * Get delivery report for a message
 * @param {string} messageId - The message ID to get the delivery report for
 * @returns {Promise<object>} - The response from the SMS API
 */
async function getDeliveryReport(messageId) {
  try {
    const data = {
      apikey: TEXTSMS_API_KEY,
      partnerID: TEXTSMS_PARTNER_ID,
      messageID: messageId,
    };
    const response = await axios.post(TEXTSMS_DLR_URL, data);
    return response.data;
  } catch (e) {
    return {
      "response-code": e.response?.data?.["response-code"] || "9999",
      "response-description":
        e.response?.data?.["response-description"] ||
        "Error: Unable to fetch delivery report",
    };
  }
}

/**
 * Get the balance of the SMS account
 * @returns {Promise<object>} - The response from the SMS API
 */
async function getAccountBalance() {
  try {
    const data = {
      apikey: TEXTSMS_API_KEY,
      partnerID: TEXTSMS_PARTNER_ID,
    };

    const response = await axios.post(TEXTSMS_BALANCE_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (e) {
    return {
      "response-code": e.response?.data?.["response-code"] || "9999",
      "response-description":
        e.response?.data?.["response-description"] ||
        "Error: Unable to fetch balance",
    };
  }
}

module.exports = {
  sendSingleSms,
  sendBulkSms,
  getDeliveryReport,
  getAccountBalance,
  scheduleSms,
};
