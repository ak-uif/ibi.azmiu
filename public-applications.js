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
        let body;
        let headers;
        if (type === 'mentor') {
          const cv = payload.cv;
          delete payload.cv;
          body = new FormData();
          body.append('application', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
          if (cv && typeof cv === 'object' && cv.name) {
            if (cv.size > 5 * 1024 * 1024) {
              throw Object.assign(new Error('CV must be 5 MB or smaller'), { code: 'file_too_large' });
            }
            body.append('cv', cv, cv.name);
          }
          headers = { Accept: 'application/json' };
        } else {
          body = JSON.stringify(payload);
          headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
        }
        const response = await fetcher(`${baseUrl.replace(/\/+$/, '')}/api/public/applications/${paths[type]}`, {
          method: 'POST',
          headers,
          body,
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
