import {supabase} from "./supabase";
import {Database} from "./database.types";

type Project = Database['public']['Tables']['projects']['Insert'];
type Action = Database['public']['Tables']['actions']['Insert'];

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

