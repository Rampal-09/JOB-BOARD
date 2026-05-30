import { createClient } from "@supabase/supabase-js";

import "dotenv/config";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

export const uploadToSupabase = (buffer, originalName, userId) => {
  const timestamp = Date.now();
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `resumes/${userId}/${timestamp}-${safeName}`;

  const {error} =  await supabase.storage.from("resumes").upload(filePath , buffer ,{
     contentType: 'application/pdf',
      upsert: false            // 
  })
   if (error) throw new Error(`Storage upload failed: ${error.message}`)

    const {data } = await supabase.storage.from("resumes").getPublicUrl(filePath)
     return data.publicUrl
};
