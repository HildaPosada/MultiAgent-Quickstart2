import type { RequestHandler } from "express";
import express from "express";
import passport from "passport";
import cookieSession from "cookie-session";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";

export type AuthUser = {
  id: string;
  displayName: string;
  email?: string;
  photo?: string;
};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev_session_secret_change_me";

const googleEnabled = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

if (googleEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      (_accessToken, _refreshToken, profile: Profile, done) => {
        const user: AuthUser = {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
          photo: profile.photos?.[0]?.value,
        };
        return done(null, user);
      },
    ),
  );
}

export function registerAuth(app: express.Express) {
  app.use(
    cookieSession({
      name: "session",
      keys: [SESSION_SECRET],
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      sameSite: "lax",
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Config endpoint so client knows if Google is enabled
  app.get("/api/auth/config", ((req, res) => {
    res.json({ googleEnabled });
  }) as RequestHandler);

  // Current user
  app.get("/api/auth/user", ((req, res) => {
    res.json({ user: req.user ?? null });
  }) as RequestHandler);

  // Logout
  app.post("/api/auth/logout", ((req, res) => {
    req.logout?.(() => {});
    req.session = null as any;
    res.json({ ok: true });
  }) as RequestHandler);

  if (googleEnabled) {
    app.get(
      "/api/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] }),
    );

    app.get(
      "/api/auth/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/?auth=failed",
      }),
      ((req, res) => {
        res.redirect("/");
      }) as RequestHandler,
    );
  } else {
    app.get("/api/auth/google", ((req, res) => {
      res
        .status(503)
        .json({ error: "Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET." });
    }) as RequestHandler);
  }
}
