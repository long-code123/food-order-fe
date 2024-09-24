const SITE_API_ENDPOINT = "http://localhost:8000/site"

export const getMainApi = () => {
	const API = SITE_API_ENDPOINT
	const c = (path = '') => API + path
	return {
      login: c('/admin/login'),
      food: c('/foods'),
      foodbycategory: (categoryId: number) => c(`/categories/${categoryId}/foods`),
      foodbystore: (storeId: number) => c(`/stores/${storeId}/foods`),
	admin: c('/admin'),
      store: c('/stores'),
      users: c('/users'),
      shippers: c('/shippers'),
      category: c('/categories'),
      voucher: c('/vouchers'),
      order: c('/orders'),
      orderbyshipper: (shipperId: number) => c(`/shippers/${shipperId}/orders`),
      payment: c('/payments'),
      paymentbystore: (storeId: number) => c(`/stores/${storeId}/payments`),
      reviewfood: c('/reviewfoods'),
      reviewshipper: c('/reviewshippers'),
      reviewbyshipper: (shipperId: number) => c(`/shippers/${shipperId}/review`),
      reviewstore: c('/reviewstores'),
      reviewbystore: (storeId: number) => c(`/stores/${storeId}/reviews`)
	}
  }