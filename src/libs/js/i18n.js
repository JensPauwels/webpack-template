import ko from 'knockout';

const loadStoredLanguage = function () {
  let languageToLoad = 'en';
  if (typeof(Storage) !== undefined) {
    let localStorageResult = localStorage.getItem('_site_lang');
    if (localStorageResult !== null && localStorageResult !== undefined) {
      languageToLoad = localStorageResult;
    };
  };
  return languageToLoad;
};

const storeLanguage = function (lang) {
  if (typeof(Storage) !== undefined) localStorage.setItem('_site_lang', lang.toLowerCase());
};

class i18n {
  constructor(locales) {
    this.locales = locales;
    this.language = ko.observable(loadStoredLanguage());
    this.language.subscribe(value => {
      this.language(value.toLowerCase());
      storeLanguage(value.toLowerCase());
    });
  };

  generateWarning = labelName => {
    return `${labelName} does not exist`;
  };

  generateVariables = (matchedLabel, parameters) => {
    return Object.keys(parameters)
      .reduce((matchedLabel, key) => matchedLabel.replace(`%${key}%`, parameters[key]), matchedLabel);
  };


  generateLabel = (labelName, parameters) => {
    return (parameters === undefined)
      ? labelName
      : this.generateVariables(labelName, parameters);
  };

  getLabel = (labelName, parameters) => {
    return ko.computed(() => {
      const labels = this.locales[this.language()];
      const matchedLabel = labels[labelName];
      return (matchedLabel !== undefined)
        ? this.generateLabel(matchedLabel, parameters)
        : this.generateWarning(labelName);
    });
  };

  get = (labelName, parameters) => {
    return this.getLabel(labelName, parameters);
  };
};

module.exports = i18n;