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
