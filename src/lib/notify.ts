// Tells the team about new bookings and applications.
// Posts to NOTIFY_WEBHOOK_URL when set (Slack and Discord both accept this
// shape); otherwise logs to the server console.

export async function notifyTeam(message: string) {
  const url = process.env.NOTIFY_WEBHOOK_URL;
  if (!url) {
    console.log("[notify]", message);
    return;
  }
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message, content: message }),
    });
  } catch (err) {
    console.error("[notify] webhook failed:", err);
  }
}
