import supabase from '../supabase/supabaseClient';

export const fetchGameSchedule = async () => {
  try {
    const { data: gameSchedule, error } = await supabase
      .from('gameSchedule')
      .select('*');
    if (error) {
      throw error;
    }
    return gameSchedule;
  } catch (error) {
    console.error('Failed to fetch game schedule:', error.message);
    throw new Error(`Failed to fetch game schedule : ${error.message}`);
  }
};
