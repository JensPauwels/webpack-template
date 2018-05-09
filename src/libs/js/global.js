import locales from '../../locales/';
import i18n from './i18n';
import {initCollapsible} from '../../assets/models/Helper';
import '../../assets/scss/global.scss';

const AJAX_PREFIX = "URL ACCESABLE";

class GlobalViewModel {
  constructor() {
    this.i18n = new i18n(locales);
    this.footerYear = ko.observable(new Date().getFullYear());
    this.envMode = ko.observable(process.env.NODE_ENV === 'production' ? 'production' : 'development');
    
    setTimeout(function() {
      $(".dropdown-button").dropdown();
      $('.autocomplete').autocomplete();
      $(".button-collapse").sideNav({closeOnClick: true });
      $('.modal').modal();
      initCollapsible();
    }, 0);
  };
}

const ready = function (instance ,cb) {
  $(() => {
    const ViewModel = new instance();
    window.viewModel = ViewModel;
    ko.applyBindings(ViewModel);
    ko.bindingHandlers.insertText = {
      init: (element, valueAccessor) => element.appendChild(document.createTextNode(` ${valueAccessor()}`)),
      update: (element, valueAccessor) => element.childNodes.forEach(selectedNode => selectedNode = ` ${valueAccessor()}`)
    };

    if (cb !== undefined) cb();
  });
};




module.exports = {
  AJAX_PREFIX,
  GlobalViewModel,
  ready
};
