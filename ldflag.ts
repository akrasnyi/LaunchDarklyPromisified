import * as LDClient from 'launchdarkly-js-client-sdk';

declare global {
  interface Window {
    Procore: any;
  }
}
type USER = {
  key: string;
  custom: any;
};
const USER: USER = {
  key: /* Here goes user key */
  custom: {
    /* Here should be custom parameters that will help us to identify
       users for targeting purposes */
  },
};
const CLIENT_ID: string = /* Here goes client id from LD Admin Panel
const FLAG_NAME: string = /* Here goes flag name */

const launchDarklyClient = ((): { getFeatureStatus: () => Promise<any> } => {
  const LD_CLIENT = LDClient.initialize(CLIENT_ID, USER);
  let featureStatus: boolean | undefined;
  const subscribe = (): void => {
    // retrieve feature flag status
    LD_CLIENT.on('ready', () => {
      featureStatus = LD_CLIENT.variation(FLAG_NAME, false);
      // subscription to possible changes
      LD_CLIENT.on(`change:${FLAG_NAME}`, (value) => {
        featureStatus = value;
      });
    });
  };

  const getFeatureStatus = (): Promise<any> => {
    return new Promise((resolve) => {
      const intervalIdForLaunch = setInterval(() => {
        if (typeof featureStatus !== 'undefined') {
          clearInterval(intervalIdForLaunch);
          resolve(featureStatus);
        }
      }, 300);
    });
  };

  subscribe();

  return {
    getFeatureStatus,
  };
})();

export default launchDarklyClient;
