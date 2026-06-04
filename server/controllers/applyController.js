import { supabase } from "../services/supabase.service.js";
const uploadToStorage = async (buffer, originalName, userId) => {
  const timestamp = Date.now();
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `resumes/${userId}/${timestamp}-${safeName}`;

  const { error } = await supabase.storage
    .from("resumes")
    .upload(filePath, buffer, {
      contentType: "application/pdf",
      upsert: false, //
    });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = await supabase.storage
    .from("resumes")
    .getPublicUrl(filePath);
  return data.publicUrl;
};

export const applyToJob = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume PDF is required" });
    }

    const { jobId, coverNote } = req.body;
    const userId = req.user.id;

    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("seeker_id", userId)
      .single();

    if (existing)
      return res.status(409).json({ error: "You already applied to this job" });

    const resumeUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      userId,
    );

    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        seeker_id: userId,
        resume_url: resumeUrl,
        cover_note: coverNote || "",
        status: "applied",
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({
      message: "Applied successfully!",
      application,
    });
  } catch (err) {
    console.error("applyToJob error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export async function getMyApplications(req, res) {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        job:jobs(id, title, location, type, recruiter:users(name))
      `,
      )
      .eq("seeker_id", req.user.id)
      .order("applied_at", { ascending: false });

    if (error) throw error;
    res.json({ applications: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
