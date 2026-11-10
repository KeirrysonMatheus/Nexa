import { after } from "next/server"

type OneSignalNotification = {
  title: string
  message: string
  externalIds: string[]
  url?: string
  /** A stable event identifier that makes a retry safe to send. */
  idempotencyKey: string
}

function getOneSignalAppId() {
  return process.env.ONESIGNAL_APP_ID ?? process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
}

export async function sendOneSignalNotification({
  title,
  message,
  externalIds,
  url,
  idempotencyKey,
}: OneSignalNotification) {
  const appId = getOneSignalAppId()
  const apiKey = process.env.ONESIGNAL_REST_API_KEY

  if (!appId || !apiKey) {
    throw new Error(
      "OneSignal push is not configured: ONESIGNAL_APP_ID (or NEXT_PUBLIC_ONESIGNAL_APP_ID) and ONESIGNAL_REST_API_KEY are required.",
    )
  }

  const recipients = [...new Set(externalIds)].filter(Boolean)
  if (recipients.length === 0) return

  const appUrl = process.env.NEXT_PUBLIC_URL
  const notificationUrl = url && appUrl ? new URL(url, appUrl).toString() : undefined

  const response = await fetch("https://api.onesignal.com/notifications?c=push", {
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
      idempotency_key: idempotencyKey,
      ...(notificationUrl ? { url: notificationUrl } : {}),
    }),
  })

  const responseBody = await response.text()
  let parsed: { id?: string; errors?: unknown } | null = null
  try {
    parsed = JSON.parse(responseBody) as { id?: string; errors?: unknown }
  } catch {
    parsed = null
  }

  const softErrors = Array.isArray(parsed?.errors) ? parsed.errors : []
  if (!response.ok || softErrors.length > 0) {
    throw new Error(
      `OneSignal rejected the notification (${response.status}): ${responseBody}`,
    )
  }
}

/** Keeps the Vercel/serverless invocation alive until the push request finishes. */
export function enqueueOneSignalNotification(
  notification: OneSignalNotification,
  context: string,
) {
  after(() =>
    sendOneSignalNotification(notification).catch((error: unknown) => {
      console.error(`Não foi possível enviar a notificação (${context}):`, error)
    }),
  )
}
