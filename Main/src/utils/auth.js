import { apiBaseUrl } from "../config/config";

export const authUtils = {
    getUserById: async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBaseUrl}/get-user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    throw new Error('Authentication failed. Please login again.');
                }
                throw new Error('Failed to fetch user data');
            }

            const result = await response.json();
            if (result) {
                const userData = {
                    user_id: result.user_id,
                    real_name: result.real_name,
                    personal_email: result.personal_email,
                    phone_number: result.phone_number,
                    birth_date: result.birth_date,
                    school_name: result.school_name,
                    school_district: result.school_district,
                    school_email: result.school_email,
                    account_username: result.account_username,
                    is_teacher: result.is_teacher,
                    city: result.city,
                    state: result.state,
                    bio: result.bio,
                    profile_img_url: result.profile_img_url,
                    avatar_name: result.avatar_name,
                    created_at: result.created_at,
                    is_admin:result.isAdmin
                };
                console.log(`Pls for the love of god2: ${JSON.stringify(userData)}`);
                return { success: true, data: userData };
            }
            return { success: false, error: 'User not found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    getUserInfo: async (username) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBaseUrl}/get-user?username=${username}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    throw new Error('Authentication failed. Please login again.');
                }
                throw new Error('Failed to fetch user data');
            }

            const result = await response.json();
            if (result && result.length > 0) {
                const userData = {
                    user_id: result[0].user_id,
                    real_name: result[0].real_name,
                    personal_email: result[0].personal_email,
                    phone_number: result[0].phone_number,
                    birth_date: result[0].birth_date,
                    school_name: result[0].school_name,
                    school_district: result[0].school_district,
                    school_email: result[0].school_email,
                    account_username: result[0].account_username,
                    is_teacher: result[0].is_teacher,
                    city: result[0].city,
                    state: result[0].state,
                    bio: result[0].bio,
                    profile_img_url: result[0].profile_img_url,
                    avatar_name: result[0].avatar_name,
                    created_at: result[0].created_at,
                    is_admin:result[0].isAdmin
                };
                // console.log(`Pls for the love of god: ${JSON.stringify(userData)}`);
                localStorage.setItem('userData', JSON.stringify(userData));
                return { success: true, data: userData };
            }
            return { success: false, error: 'User not found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Login
    login: async (username, password) => {
        try {
            const response = await fetch(`${apiBaseUrl}/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({ username }));
                
                // Get user data immediately after successful login
                const userResult = await authUtils.getUserInfo(username);
                if (userResult.success) {
                    localStorage.setItem('userData', JSON.stringify(userResult.data));
                }
                return { success: true, data: userResult.data };
            }
            return { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: 'Login failed' };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('user');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get stored user data
    getStoredUserData: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },

    // Update stored user data
    updateStoredUserData: (userData) => {
        localStorage.setItem('userData', JSON.stringify(userData));
    },

    // Refresh user data
    refreshUserData: async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user?.username) {
                const result = await authUtils.getUserInfo(user.username);
                if (result.success) {
                    localStorage.setItem('userData', JSON.stringify(result.data));
                    return { success: true, data: result.data };
                }
            }
            return { success: false, error: 'Could not refresh user data' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Make authenticated request
    authenticatedRequest: async (url, options = {}) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    throw new Error('Authentication failed');
                }
                throw new Error('Request failed');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Check if stored data is stale (older than 30 minutes)
    isDataStale: () => {
        const lastUpdate = localStorage.getItem('lastUserDataUpdate');
        if (!lastUpdate) return true;
        
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
        return (Date.now() - parseInt(lastUpdate)) > thirtyMinutes;
    },

    // Update last refresh timestamp
    updateLastRefreshTimestamp: () => {
        localStorage.setItem('lastUserDataUpdate', Date.now().toString());
    }


};
