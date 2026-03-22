import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_BASE from '../api/config';

function useSkills(search = '', category = '') {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      const { data } = await axios.get(`${API_BASE}/api/skills/?${params}`);
      setSkills(data.results ?? data);
    } catch {
      setError('Failed to load skills. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { skills, loading, error, refetch: fetchSkills };
}

export default useSkills;