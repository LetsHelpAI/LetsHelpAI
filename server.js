const express = require("express");
const bodyParser = require("body-parser");
const VoiceResponse = require("twilio").twiml.VoiceResponse;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// --- RULE-BASED LOGIC ---
// Edit responses inside this object.
// Later you can load these from a client database.
const rules = [
  { keywords: ["hours", "open", "close"], reply: "Our business hours are 9 AM to 5 PM, Monday through Friday." },
  { keywords: ["appointment", "schedule", "book"], reply: "I can take a note for an appointment. What time would you like?" },
  { keywords: ["location", "address", "where"], reply: "We are located at 123 Main Street." },
  { keywords: ["tour"], reply: "I can record a note for a tour. What day works best for you?" },
];

// Match caller input to rule
function ruleEngine(transcript) {
  transcript = transcript.toLowerCase();
  for (const rule of rules) {
    for (const k of rule.keywords) {
      if (transcript.includes(k)) return rule.reply;
    }
  }
  return "I'm sorry, I didn't understand. Could you repeat that?";
}

// --- MAIN CALL HANDLER ---
app.post("/voice", (req, res) => {
  const twiml = new VoiceResponse();

  twiml.gather({
    input: "speech",
    speechTimeout: "auto",
    action: "/process",
  }).say("Hello, this is the automated receptionist. How can I help you today?");

  res.type("text/xml");
  res.send(twiml.toString());
});

// --- HANDLE SPEECH RECOGNITION ---
app.post("/process", (req, res) => {
  const transcript = req.body.SpeechResult || "";
  const reply = ruleEngine(transcript);

  const twiml = new VoiceResponse();
  twiml.say(reply);

  // Continue the conversation
  twiml.redirect("/voice");

  res.type("text/xml");
  res.send(twiml.toString());
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

