// @flow

/**
 * getLocationOrigin returns dynamically base url
 *
 * @export
 * @returns {string} location origin
 */
export function getLocationOrigin(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  if (!window.location.origin) {
    window.location.origin = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
  }

  return window.location.origin;
}
