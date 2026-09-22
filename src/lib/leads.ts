export type LeadType = 'quote' | 'contact';

// Sends a form submission to server.js, which stores it for the Leads page in /admin.
export async function submitLead(type: LeadType, fields: Record<string, string>) {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, fields, page: window.location.pathname }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || 'Something went wrong. Please try again.');
  }
}
