import * as amplitude from '@amplitude/analytics-browser';

const apiKey = process.env.AMPLITUDE_API_KEY;

amplitude.init(apiKey);

export const trackEvent = (eventName, eventProperties) => {
  amplitude.track(eventName, eventProperties);
};

export default amplitude;