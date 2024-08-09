const SITE_API_ENDPOINT = "http://localhost:8000/sites"

export const getMainApi = () => {
	const API = SITE_API_ENDPOINT
	const c = (path = '') => API + path
	return {
      login: c('/login'),
	  admin: c('/admin'),
      users: c('/users'),
      category: c('/category'),
	}
  }