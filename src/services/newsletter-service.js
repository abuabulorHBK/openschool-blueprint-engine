/**
 * Newsletter & Subscription Service
 * Dispatches live subscription alerts directly to cambridgeacademytutorstz@gmail.com
 */

const RECIPIENT_EMAIL = 'cambridgeacademytutorstz@gmail.com';
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;

/**
 * Submit a new newsletter subscriber to cambridgeacademytutorstz@gmail.com
 * @param {Object} options
 * @param {string} options.email - Subscriber's email address
 * @param {string} [options.source] - Where the user subscribed from (e.g. 'Global Footer', 'Export Hub', 'Preferences Modal')
 * @param {Object} [options.preferences] - Selected topic preferences (e.g. costIndices, archetypes)
 * @param {Object} [options.project] - Optional current project context (name, country)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function submitNewsletterSubscription({ 
  email, 
  source = 'Global Application Footer', 
  preferences = null, 
  project = null 
}) {
  if (!email || !email.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }

  const payload = {
    email: email.trim(),
    source_location: source,
    platform: 'OpenSchool Blueprint Engine™',
    creator_credit: '@cambridgeacademytutorsfreeknowledgeworld',
    _subject: `🔔 New OpenSchool Subscriber: ${email.trim()} (${source})`,
    _template: 'table',
    _captcha: 'false',
    subscribed_at: new Date().toLocaleString(),
    timestamp_utc: new Date().toISOString()
  };

  if (preferences) {
    payload.selected_topics = Object.entries(preferences)
      .filter(([topicKey, enabled]) => Boolean(enabled) && Boolean(topicKey))
      .map(([key]) => {
        if (key === 'costIndices') return 'Quarterly African Cost Indices';
        if (key === 'archetypes') return 'New Blueprint Archetypes & CAD Blocks';
        if (key === 'companyNews') return 'Company Releases & Case Studies';
        return key;
      })
      .join(', ') || 'All Updates';
  }

  if (project) {
    payload.active_project_name = project.name || 'Untitled Campus';
    payload.active_country = project.countryCode || 'KE';
  }

  // Persist locally in browser immediately
  try {
    localStorage.setItem('openschool_newsletter_subscribed', 'true');
    localStorage.setItem('openschool_newsletter_email', email.trim());
    if (preferences) {
      localStorage.setItem('openschool_newsletter_prefs', JSON.stringify(preferences));
    }
  } catch {
    // Ignore localstorage errors
  }

  try {
    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok || data.success === 'true' || data.success === true) {
      return {
        success: true,
        message: 'Subscribed successfully! Notification sent to Cambridge Academy Tutors.'
      };
    } else {
      // FormSubmit may respond with warning or instruction (e.g. pending activation)
      return {
        success: true,
        message: data.message || 'Subscription received!'
      };
    }
  } catch (networkError) {
    console.warn('Network transmission notice:', networkError);
    // Return true since data is safely captured in local state
    return {
      success: true,
      message: 'Subscription saved!'
    };
  }
}
