import {supabase} from "./supabase";
import {Database} from "./database.types";

type Project = Database['public']['Tables']['projects']['Insert'];
type Action = Database['public']['Tables']['actions']['Insert'];

const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || '';

export const createProject = async (project: Project) => {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  return data;
};

export const createAction = async (action: Action) => {
  const { data, error } = await supabase
    .from('actions')
    .insert(action)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating action:', error);
    return null;
  }
  
  return data;
};

/**
 * Upload a photo to the project's media bucket.
 * @param projectId Project ID or slug
 * @param file File buffer or Blob
 * @param filename Name for the file (e.g., 'screenshot.png')
 * @returns Public URL or null
 */
export const uploadProjectPhoto = async (
  file: File | Blob | Buffer,
  filename: string,
  projectId: string,
  personality: string
) => {
  const path = `${SUPABASE_PROJECT_ID}/${projectId}/${personality}/photos/${filename}`;
  const { data, error } = await supabase.storage
    .from('project-media')
    .upload(path, file, { upsert: true, contentType: 'image/png' });
  if (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
  const url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
  const { data: mediaData, error: mediaError } = await supabase
    .from('media')
    .insert({
      project_id: projectId,
      personality,
      type: 'photo',
      url,
      filename,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (mediaError) {
    console.error('Error inserting media record:', mediaError);
    return null;
  }

  return url;
//   const { data: updateData, error: updateError } = await supabase
//     .from('media')

};

/**
 * Upload a video to the project's media bucket.
 * @param projectId Project ID or slug
 * @param file File buffer or Blob
 * @param filename Name for the file (e.g., 'test-video.webm')
 * @returns Public URL or null
 */
export const uploadProjectVideo = async (
  file: File | Blob | Buffer,
  filename: string,
  projectId: string,
  personality: string
) => {
  const path = `${SUPABASE_PROJECT_ID}/${projectId}/${personality}/videos/${filename}`;
  const { data, error } = await supabase.storage
    .from('project-media')
    .upload(path, file, { upsert: true, contentType: 'video/webm' });
  if (error) {
    console.error('Error uploading video:', error);
    return null;
  }
  const url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
  const { data: mediaData, error: mediaError } = await supabase
    .from('media')
    .insert({
      project_id: projectId,
      personality,
      type: 'video',
      url,
      filename,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
};
