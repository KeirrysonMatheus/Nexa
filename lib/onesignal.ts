type OneSignalNotification = {
  title: string
  message: string
  externalIds: string[]
  url?: string
}

export async function sendOneSignalNotification({
  title,
  message,
  externalIds,
  url,
}: OneSignalNotification) {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
  const apiKey = process.env.ONESIGNAL_REST_API_KEY

  if (!appId || !apiKey) {
    throw new Error(
      "OneSignal push is not configured: NEXT_PUBLIC_ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY are required.",
    )
  }

  const recipients = [...new Set(externalIds)].filter(Boolean)
  if (recipients.length === 0) return

  const appUrl = process.env.NEXT_PUBLIC_URL
  const notificationUrl = url && appUrl ? new URL(url, appUrl).toString() : undefined

  const response = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${apiKey}`,
    },
    body: JSON.stringify({
      app_id: appId,
      target_channel: "push",
      include_aliases: { external_id: recipients },
      headings: { pt: title, en: title },
      contents: { pt: message, en: message },
      ...(notificationUrl ? { url: notificationUrl } : {}),
    }),
  })

  if (!response.ok) {
    const responseBody = await response.text()
    throw new Error(
      `OneSignal rejected the notification (${response.status}): ${responseBody}`,
    )
  }
}
