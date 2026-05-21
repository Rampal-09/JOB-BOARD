import { createClient } from "@supabase/supabase-js";
import { supabase } from "../services/supabase.service";
import jwt from "jsonwebtoken";

const sendOTP = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: "Email and role are required" });
    }

    if (!["seeker", "recruiter"].includes(role)) {
      return res
        .status(400)
        .json({ error: "role must be seeker or recruiter" });
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: { role },
      },
    });

    if (error) throw error;
    res.json({ message: `OTP sent to ${email}` });
  } catch (err) {
    console.error("Error sending OTP:", err.message);
    res.status(500).json({ error: err.message });
  }
};
