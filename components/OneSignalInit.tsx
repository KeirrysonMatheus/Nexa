"use client";

import { useEffect, useRef } from "react";
import OneSignal from "react-onesignal";
import { authClient } from "@/lib/auth-client";

export default function OneSignalInit() {
  const { data: session, isPending } = authClient.useSession();
  const initialization = useRef<Promise<void> | null>(null);

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
