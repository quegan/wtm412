import { CONFIG } from './config.js';
const $ = (id) => document.getElementById(id);
const form = $('form'), err = $('err'), btn = $('submit');
const params = new URLSearchParams(location.search);
const ref = (params.get('r') || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
if (ref) { $('referred').textContent = 'A friend sent you their link.'; $('referred').hidden = false; }

const MESSAGES = {
  age_required: 'Please confirm you’re 17 or older.',
  name_invalid: 'Enter your first name.',
  contact_invalid: 'Enter a valid email or US phone number.',
  rate_limited: 'Too many tries. Give it an hour.',
  already_on_list: 'You’re already on the waitlist.',
};

function showDone(code) {
  const link = CONFIG.siteUrl + '?r=' + code;
  $('mylink').textContent = link;
  form.hidden = true; $('intro').hidden = true; $('referred').hidden = true; $('done').hidden = false;
  window.scrollTo(0, 0);
  $('copy').onclick = async () => {
    try { await navigator.clipboard.writeText(link); }
    catch { const r = document.createRange(); r.selectNodeContents($('mylink')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand('copy'); }
    $('copy').textContent = 'Copied';
    setTimeout(() => { $('copy').textContent = 'Copy link'; }, 1800);
  };
  const shareData = { title: 'WTM 412', text: 'Get on the WTM 412 waitlist with me. Invite-only beta opening January 2027.', url: link };
  $('share').onclick = async () => {
    if (navigator.share) { try { await navigator.share(shareData); } catch {} }
    else { location.href = 'sms:?&body=' + encodeURIComponent(shareData.text + ' ' + link); }
  };
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  err.textContent = '';
  const fd = new FormData(form);
  if (String(fd.get('website') || '').trim()) return;
  const first = String(fd.get('first_name') || '').trim();
  const contact = String(fd.get('contact') || '').trim();
  if (!first) { err.textContent = MESSAGES.name_invalid; return; }
  if (!contact) { err.textContent = MESSAGES.contact_invalid; return; }
  if (!fd.get('age')) { err.textContent = MESSAGES.age_required; return; }
  btn.disabled = true; btn.textContent = 'Joining…';
  try {
    const res = await fetch(CONFIG.supabaseUrl + '/rest/v1/rpc/waitlist_join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: CONFIG.supabaseAnonKey, Authorization: 'Bearer ' + CONFIG.supabaseAnonKey },
      body: JSON.stringify({ p_first_name: first, p_contact: contact, p_age_ok: true, p_ref: ref || null }),
    });
    const body = await res.json().catch(() => null);
    if (res.ok && typeof body === 'string') { showDone(body); return; }
    const key = body && body.message;
    err.textContent = MESSAGES[key] || 'Something went wrong. Try again in a minute.';
  } catch { err.textContent = 'Couldn’t reach the server. Check your connection and try again.'; }
  btn.disabled = false; btn.textContent = 'Join the waitlist';
});
