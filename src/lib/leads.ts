export type LeadType = 'quote' | 'contact';

// Sends a form submission to server.js, which stores it for the Leads page in /admin.
export interface LeadAttachment {
  name: string;
  data: string;
}

export async function submitLead(type: LeadType, fields: Record<string, string>, attachments: LeadAttachment[] = []) {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, fields, attachments, page: window.location.pathname }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || 'Something went wrong. Please try again.');
  }
}
