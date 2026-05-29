import { createClient } from "@supabase/supabase-js";
import { supabase } from "../services/supabase.service.js";
import jwt from "jsonwebtoken";

export const sendOtp = async (req, res) => {
  console.log("req came to senOtp auth controller");
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

export const verifyOtp = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    const supabaseUser = data.user;
    const role = supabaseUser.user_metadata.role ?? "seeker";
    let { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({ email, role })
        .select()
        .single();

      if (insertError) throw insertError;

      existingUser = newUser;
    }

    const jwtToken = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({
      token: jwtToken,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        name: existingUser.name,
      },
    });
  } catch (err) {
    console.error("Error verifying OTP:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { data, error } = await supabase.signOut();
    if (error) throw error;
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error logging out:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();
    if (error) throw error;
    res.json({ user: data });
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: err.message });
  }
};
