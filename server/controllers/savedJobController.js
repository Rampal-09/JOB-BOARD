import { supabase } from "../services/supabase.service.js";

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const { data, error } = await supabase
      .from("saved_jobs")
      .insert({
        user_id: req.user.id,
        job_id: jobId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(200).json({ message: "Job already saved" });
      }
      throw error;
    }

    return res.status(201).json({ message: "Job saved", savedJob: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", req.user.id)
      .eq("job_id", jobId);

    if (error) throw error;

    return res.status(200).json({ message: "Job removed from saved jobs" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMySavedJobs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("saved_jobs")
      .select(
        `
        id,
        job_id,
        create_at,
        job:jobs(*, recruiter:users(id, name, email))
      `,
      )
      .eq("user_id", req.user.id)
      .order("create_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({ savedJobs: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
