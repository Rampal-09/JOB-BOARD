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
