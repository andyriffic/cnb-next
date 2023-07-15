export const isClientSideFeatureEnabled = (featureName: string): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.search.includes(`${featureName}=true`);
};
