const getMyJobs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select(`*, applications(count)`)
      .eq("recruiter_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ jobs: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getApplicants = async (req, res) => {
  try {
    const { data: job } = await supabase
      .from("jobs")
      .select("recruiter_id, title")
      .eq("id", req.params.jobId)
      .single();

    if (job?.recruiter_id !== req.user.id) {
      return res.status(403).json({ error: "Not your job" });
    }

    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        id, status, cover_note, resume_url, applied_at,
        seeker:users(id, name, email)
      `,
      )
      .eq("job_id", req.params.jobId)
      .order("applied_at", { ascending: false });

    if (error) throw error;
    res.json({ applicants: data, jobTitle: job.title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
