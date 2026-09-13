const API_URL = process.env.NEXT_PUBLIC_API_UR;
const MERCHANT = process.env.NEXT_PUBLIC_MERCHANT_SLUG;
const headers = {"X-Merchant-Slug": MERCHANT}
export async function getlanding () {
    console.log('API_URL:', API_URL);
    const response = await fetch('${API_URL}/public/landing', { headers });
    return response.json();
}