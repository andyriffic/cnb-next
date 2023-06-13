export const isClientSideFeatureEnabled = (featureName: string): boolean => {
  if (!window) {
    return false;
  }

  return window.location.search.includes(`${featureName}=true`);
};
