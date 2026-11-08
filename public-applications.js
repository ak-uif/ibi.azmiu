const paths = Object.freeze({
  program: 'programs',
  event: 'events',
  mentor: 'mentors',
  idea: 'startups',
});

export function createApplicationSubmitter(baseUrl = 'http://localhost:8080', fetcher = fetch) {
  let inFlight = false;
  return {
    get inFlight() { return inFlight; },
    async submit(type, formData) {
      if (inFlight) throw Object.assign(new Error('Submission in progress'), { code: 'in_progress' });
      if (!Object.hasOwn(paths, type)) throw new Error('Unknown application type');
      inFlight = true;
      try {
        const payload = Object.fromEntries(formData);
        const response = await fetcher(`${baseUrl.replace(/\/+$/, '')}/api/public/applications/${paths[type]}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw Object.assign(new Error(error.message || 'Submission failed'), {
            code: error.code || 'server_error',
          });
        }
        const result = await response.json();
        if (response.status !== 201 || result.status !== 'submitted') {
          throw Object.assign(new Error('Submission was not confirmed'), { code: 'server_error' });
        }
        return result;
      } finally {
        inFlight = false;
      }
    },
  };
}
