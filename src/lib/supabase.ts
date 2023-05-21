import { RequestEventAction, RequestEventLoader } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const supabaseClient = (requestEv: RequestEventLoader<QwikCityPlatform> | RequestEventAction<QwikCityPlatform>) => createServerClient(
    requestEv.env.get("PUBLIC_SUPABASE_URL")!,
    requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
    requestEv
);