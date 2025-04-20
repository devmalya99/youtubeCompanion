

import { OAuth2Client } from "google-auth-library";
import prisma from "../lib/db.js";

const client = new OAuth2Client();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

export const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID, // replace this with your actual client ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { googleId: sub },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: sub,
          email,
          name,
          picture,
        },
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
