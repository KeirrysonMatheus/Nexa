import { after } from "next/server"

type OneSignalNotification = {
  title: string
  message: string
  externalIds: string[]
  url?: string
  /** A stable event identifier that makes a retry safe to send. */
  idempotencyKey: string
}

type OneSignalResponse = {
  id?: string
  recipients?: number
  errors?: unknown
  [key: string]: unknown
}

function hasOneSignalErrors(errors: unknown) {
  if (errors == null) return false
  if (Array.isArray(errors)) return errors.length > 0
  if (typeof errors === "object") return Object.keys(errors).length > 0
  return Boolean(errors)
}

export async function sendOneSignalNotification({
  title,
  message,
  externalIds,
  url,
  idempotencyKey,
}: OneSignalNotification) {
  const appId = process.env.ONESIGNAL_APP_ID
  const apiKey = process.env.ONESIGNAL_REST_API_KEY

  if (!appId || !apiKey) {
    console.error(
      "OneSignal push is not configured. Set ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY in the deployment environment.",
    )
    return null
  }

  const recipients = [...new Set(externalIds)].filter(Boolean)
  if (recipients.length === 0) {
    console.error("OneSignal push skipped: no external IDs were provided.")
    return null
  }

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

  const data = (await response.json().catch(() => null)) as OneSignalResponse | null

  if (!response.ok) {
    console.error("OneSignal HTTP error", response.status, data)
    return data
  }

  if (hasOneSignalErrors(data?.errors)) {
    console.error("OneSignal returned errors:", {
      status: response.status,
      body: data,
      recipients: data?.recipients,
      id: data?.id,
    })
    return data
  }

  if (data?.recipients === 0) {
    console.error("OneSignal returned no recipients:", {
      status: response.status,
      body: data,
      recipients: data.recipients,
      id: data.id,
    })
  } else {
    console.info("OneSignal queued:", data?.id, "recipients:", data?.recipients)
  }

  return data
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
