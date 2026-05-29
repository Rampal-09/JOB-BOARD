import { supabase } from "../services/supabase.service";

export const getJobs = async (req, res) => {
  try {
    const query = supabase
      .from("jobs")
      .select(`* recruiter:users(id, name ,email)`)
      .eq("status", "open")
      .order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({ jobs: data });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select(`*  recruiter:users(id,name,email) `)
      .eq("id", req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: "Job not found" });
    return res.status(200).json({ job: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      type,
      min_salary,
      max_salary,
      skills,
    } = req.body;

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        recruiter_id: req.user.id,
        title,
        description,
        location,
        type,
        min_salary,
        max_salary,
        skills: skills || [],
      })
      .select()
      .single();

    return res.status(201).json({ job: data });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from("jobs")
      .select(" recruiter_id")
      .eq(recruiter_id, req.params.id)
      .single();

    if (existing?.recruiter_id !== req.user.id) {
      return res.status(403).json({ error: "Not your job listing" });
    }
    const { data, error } = await supabase
      .from("jobs")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();
    return res.status(200).json({ job: data });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const closeJob = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from("jobs")
      .select("recruiter_id")
      .eq(recruiter_id, req.params.id)
      .single();

    if (existing?.recruiter_id == !req.params.id) {
      return res.status(403).json({ error: "Not your job listing" });
    }

    const { data, error } = await supabase
      .from("jobs")
      .update("status", "close")
      .select()
      .single();

    res.json({ message: "Job closed" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
