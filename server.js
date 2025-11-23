// Basic AI Receptionist Server (no AI model added yet)
// Handles incoming Twilio calls, gathers speech, and returns simple responses

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Root test endpoint
app.get("/", (req, res) => {
  res.send("LetsHelpAI backend is running.");
});

// Handle incoming calls from Twilio
app.post("/voice", (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();

  // Greeting the caller
  twiml.say(
    {
      voice: "alice"
    },
    "Hello, this is Lets Help A I, your virtual receptionist. How may I assist you today?"
  );

  // Ask caller for input
  twiml.gather({
    input: "speech",
    action: "/process_speech",
    method: "POST"
  });

  res.type("text/xml");
  res.send(twiml.toString());
});

// Process the caller's speech
app.post("/process_speech", (req, res) => {
  const speechText = req.body.SpeechResult || "";

  const twiml = new twilio.twiml.VoiceResponse();

  // Placeholder response logic
  // (Later we connect this to an AI model)
  twiml.say(
    {
      voice: "alice"
    },
    `You said: ${speechText}. A more advanced response system will be added soon.`
  );

  // Continue listening
  twiml.gather({
    input: "speech",
    action: "/process_speech",
    method: "POST"
  });

  res.type("text/xml");
  res.send(twiml.toString());
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LetsHelpAI server running on port ${PORT}`);
});
