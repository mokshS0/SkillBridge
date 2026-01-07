import { apiBaseUrl } from "../../config/config";

export const getAISuggestedBio = async (input) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${apiBaseUrl}/generate-bio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add authentication header
      },
      body: JSON.stringify({ userInput: input }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to generate bio' }));
      throw new Error(errorData.message || 'Failed to generate bio');
    }

    const data = await response.json();
    return data.bio;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};