import { env } from '@/lib/constants/env';

export async function createInquiry(data) {
    const BEARER_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NybS5qb2JzYWRtaXJlLmNvbS9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc1Mzc5OTUzNiwiZXhwIjoxNzg1MzU3MTM2LCJuYmYiOjE3NTM3OTk1MzYsImp0aSI6ImRWWUMxa25ZTTRPNmJLeHIiLCJzdWIiOiI2NCIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.n3NK35juH7XulRqtS3DHXuJCpoEQ-PcKA4wZbyrK6JE'; // Replace with your actual bearer token
    const response = await fetch(`${env.CRM_API_URL}/api/consultancy/inquiries/create`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${BEARER_TOKEN}`},
        body: JSON.stringify(data),
    });
    // if (!response.ok) {
    //     throw responseMessage?.message ?? responseMessage?.error ?? response.statusText;
    // }
    return await response.json()
}

export async function createInquiryFromRecruiter(data) {
    const BEARER_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NybS5qb2JzYWRtaXJlLmNvbS9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc1Mzc5OTUzNiwiZXhwIjoxNzg1MzU3MTM2LCJuYmYiOjE3NTM3OTk1MzYsImp0aSI6ImRWWUMxa25ZTTRPNmJLeHIiLCJzdWIiOiI2NCIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.n3NK35juH7XulRqtS3DHXuJCpoEQ-PcKA4wZbyrK6JE'; // Replace with your actual bearer token
    const response = await fetch(`${env.CRM_API_URL}/api/consultancy/inquiries/recruiters`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${BEARER_TOKEN}`},
        body: JSON.stringify(data),
    });
    const responseMessage = await response.json();
    if (!response.ok) {
        throw responseMessage?.message ?? responseMessage?.error ?? response.statusText;
    }
    return responseMessage
}


export async function createInquiryFromBusinessOwner(data) {
    const BEARER_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NybS5qb2JzYWRtaXJlLmNvbS9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc1Mzc5OTUzNiwiZXhwIjoxNzg1MzU3MTM2LCJuYmYiOjE3NTM3OTk1MzYsImp0aSI6ImRWWUMxa25ZTTRPNmJLeHIiLCJzdWIiOiI2NCIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.n3NK35juH7XulRqtS3DHXuJCpoEQ-PcKA4wZbyrK6JE'; // Replace with your actual bearer token
    const response = await fetch(`${env.CRM_API_URL}/api/consultancy/inquiries/business-owners`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${BEARER_TOKEN}`},
        body: JSON.stringify(data),
    });
    const responseMessage = await response.json();
    if (!response.ok) {
        throw responseMessage?.message ?? responseMessage?.error ?? response.statusText;
    }
    return responseMessage
}
