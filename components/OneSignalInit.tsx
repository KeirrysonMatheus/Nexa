"use client";

import { useEffect, useRef } from "react";
import OneSignal from "react-onesignal";
import { authClient } from "@/lib/auth-client";

async function syncPushSubscription() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return
  if (!("Notification" in window) || Notification.permission !== "granted") return

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return

  const keys = subscription.toJSON().keys;
  if (!keys?.p256dh || !keys.auth) return

  const response = await fetch("/api/push-subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    }),
  });

  if (!response.ok) {
    throw new Error(`Push subscription sync failed (${response.status}).`);
  }
}

export default function OneSignalInit() {
  const { data: session, isPending } = authClient.useSession();
  const initialization = useRef<Promise<void> | null>(null);
  const subscriptionListenerRegistered = useRef(false);

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    if (isPending) return;

    if (!appId) {
      console.error(
        "OneSignal is not configured: NEXT_PUBLIC_ONESIGNAL_APP_ID is missing.",
      );
      return;
    }

    initialization.current ??= OneSignal.init({
      appId,
      serviceWorkerPath: "/OneSignalSDKWorker.js",
      serviceWorkerUpdaterPath: "/OneSignalSDKUpdaterWorker.js",
      serviceWorkerParam: { scope: "/" },
      notifyButton: {
        enable: true,
        prenotify: true,
        showCredit: false,
        text: {
          "dialog.blocked.message":
            "Siga as instruções para permitir notificações.",
          "dialog.blocked.title": "Notificações bloqueadas",
          "dialog.main.button.subscribe": "Inscrever",
          "dialog.main.button.unsubscribe": "Cancelar inscrição",
          "dialog.main.title": "Gerenciar notificações",
          "message.action.resubscribed": "Você está inscrito nas notificações.",
          "message.action.subscribed": "Você está inscrito nas notificações.",
          "message.action.subscribing": "Inscrevendo...",
          "message.action.unsubscribed":
            "Você não receberá mais notificações.",
          "message.prenotify": "Clique para se inscrever nas notificações.",
          "tip.state.blocked": "Você bloqueou as notificações.",
          "tip.state.subscribed": "Você está inscrito nas notificações.",
          "tip.state.unsubscribed": "Inscreva-se nas notificações.",
        },
      },
      allowLocalhostAsSecureOrigin: process.env.NODE_ENV === "development",
    });

    void initialization.current
      .then(async () => {
        if (session?.user?.id) {
          await OneSignal.login(session.user.id);
          if ("Notification" in window && Notification.permission === "granted") {
            await OneSignal.User.PushSubscription.optIn();
          }
          await syncPushSubscription();

          if (!subscriptionListenerRegistered.current) {
            OneSignal.User.PushSubscription.addEventListener("change", () => {
              void syncPushSubscription().catch((error: unknown) => {
                console.error("OneSignal push subscription sync failed.", error);
              });
            });
            subscriptionListenerRegistered.current = true;
          }
        } else {
          await OneSignal.logout();
        }
      })
      .catch((error: unknown) => {
        console.error("OneSignal failed to initialize or identify the user.", error);
      });
  }, [isPending, session?.user?.id]);

  return null;
}
