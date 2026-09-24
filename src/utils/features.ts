/**
 * Whether SERVICE Build Category can be used for creating Build Configs and starting Builds.
 */
export const SERVICE_BUILD_CATEGORY = {
  isEnabled: import.meta.env.VITE_PNC_INSTANCE !== 'primary',
  disabledReason: 'SERVICE Build Category is not supported.',
};
