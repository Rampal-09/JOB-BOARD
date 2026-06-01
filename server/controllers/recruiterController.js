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

export async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const VALID = ["applied", "shortlisted", "rejected", "hired"];

    if (!VALID.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Fetch application + verify ownership via job
    const { data: app } = await supabase
      .from("applications")
      .select(`id, job:jobs(recruiter_id), seeker:users(email, name)`)
      .eq("id", req.params.appId)
      .single();

    if (app?.job?.recruiter_id !== req.user.id) {
      return res.status(403).json({ error: "Not your application to update" });
    }
    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", req.params.appId)
      .select()
      .single();

    if (error) throw error;
    res.json({ application: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getResumeUrl(req, res) {
  try {
    const { data: app } = await supabase
      .from("applications")
      .select("resume_url, job:jobs(recruiter_id)")
      .eq("id", req.params.appId)
      .single();

    if (app?.job?.recruiter_id !== req.user.id) {
      return res.status(403).json({ error: "Not your application" });
    }

    // Extract storage path from public URL
    const path = app.resume_url.split("/storage/v1/object/public/resumes/")[1];

    // Generate signed URL valid for 60 seconds
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(path, 60);

    if (error) throw error;
    res.json({ url: data.signedUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
