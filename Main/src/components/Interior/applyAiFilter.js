import { apiBaseUrl } from '../../config/config';

export async function applyAiFilter(jobPosts, users) {
    try {
        console.log('Job Posts:', jobPosts);
        console.log('Users:', users);
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/generate-filter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ jobPosts, users }), 
        });
    
        if (!response.ok) {
          throw new Error('Failed to generate job recommendations');
        }
    
        const data = await response.json();
        return data.filteredJobs;

      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
}
