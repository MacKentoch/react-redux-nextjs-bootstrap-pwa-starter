// @flow

export function registerBeforeinstallprompt(): void {
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', async e => {
      // beforeinstallprompt Event fired
      try {
        // e.userChoice will return a Promise.
        const choiceResult = await e.userChoice;
        if (choiceResult.outcome === 'dismissed') {
          /* eslint-disable no-console */
          console.log('User cancelled home screen install');
          /* eslint-enable no-console */
        } else {
          /* eslint-disable no-console */
          console.log('User added to home screen');
          /* eslint-enable no-console */
        }
      } catch (error) {
        /* eslint-disable no-console */
        console.error(
          'user choice prompt promise failed to resolve, error: ',
          error,
        );
        /* eslint-enable no-console */
      }
    });
  }
}
