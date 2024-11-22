// composables/state.ts

export const useLanguageSwitching = () => {
  return useState('isLanguageSwitching', () => false);
};

export const useOldLocale = () => {
    return useState('oldLocale', () => '');
  };

  export const useSelectedPostIndex = () => {
    return useState('selectedPostIndex', () => 0);
  };