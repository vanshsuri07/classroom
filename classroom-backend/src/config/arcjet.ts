
import arcjet, { shield, detectBot, tokenBucket, slidingWindow } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";

if(!process.env.ARCJET_KEY && process.env.ARCJET_ENV !== 'development') {
  throw new Error("ARCJET_KEY is not set in environment variables");
}

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE", 
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
         "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
         "CATEGORY:UNKNOWN" // Allow UNKNOWN to reduce false positives
      ],
    }),
    slidingWindow({
        mode: "LIVE",
        interval:'2s',
        max: 5,
    })
  ],
});

export default aj;