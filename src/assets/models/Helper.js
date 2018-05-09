
const doAjax = function(url, method, data) {
  return $.ajax({ url, method, data: JSON.stringify(data) });
};

const objectToKnockOut = function(object) {
  const tmp = {};
  const keys = Object.keys(object);
  const values = Object.values(object);
  keys.forEach((key, index) => tmp[key] = ko.observable(values[index]));
  return ko.observable(tmp);
};

const getObservable = function (object, item, type, defaultValue) {
  if (object !== undefined && object[item] !== undefined) {
    if (type === 'array') return ko.observableArray(object[item]);
    else if (type === 'object' && typeof(object[item]) === 'object') return objectToKnockOut(object[item]);
    else if (type === 'object') return ko.observable(object[item]);
  } else if (object !== undefined && object[item] === undefined && type === 'object') {
    return ko.observable((defaultValue !== undefined) ? defaultValue : '');
  } else if (object !== undefined && object[item] === undefined && type === 'array') {
    return ko.observableArray((defaultValue !== undefined) ? defaultValue : []);
  } else if (object === undefined && type === 'array') {
    return ko.observableArray((defaultValue !== undefined) ? defaultValue : []);
  } else if (object === undefined && type === 'object') {
    return ko.observable((defaultValue !== undefined) ? defaultValue : '');
  }
};

const fakeHandleCall = function (errors, url, method, object) {
  return new Promise((resolve, reject) => {
    resolve(object);
  });
};

const handleCall = function (errors, url, method, object) {
  return new Promise((resolve, reject) => {
    if (errors.length !== 0) reject(errors);
    else 
      doAjax(url, method, object)
        .then(res => resolve(res))
        .catch(err => reject(err));
  });
}

const DisplayObservable = function (arrToUse, objToWatch, param) {
  const tmp = arrToUse().find(obj => obj.id() === objToWatch());
  const value = (tmp !== undefined) ? ko.observable(tmp[param]()) : ko.observable(undefined);

  objToWatch.subscribe(val => {
    if (val !== undefined) value(arrToUse().find(obj => obj.id() === val)[param]());
  });

  return value;
};

const doAsyncAjax = async function (url, method, data) {
  try {
    const result = await $.ajax({ url, method, data: JSON.stringify(data) });
    return result;
  }
  catch (error) {
    console.error(error);
  }
};


const initCollapsible = function () {
  $('.collapsible').collapsible();
  $('body .antiCollapse').on('click', ev => ev.stopPropagation());
};

const getFilteredResult = async function (column, filter, url) {
  const options = {
    page: 1,
    count: 50,
    sort: false,
    sortrules: [],
    filters: [{ column, filter }] 
  };

  return  doAsyncAjax(url, 'POST', options);
}


const completeMessage = function (message) {
  Materialize.toast(message, 3000, 'green accent-4');
};

const failedMessage = function (message) {
  Materialize.toast(message, 3000, 'red accent-4');
};

module.exports = {
  doAjax,
  doAsyncAjax,
  objectToKnockOut,
  DisplayObservable,
  getObservable,
  fakeHandleCall,
  handleCall,
  getFilteredResult,
  initCollapsible,
  failedMessage,
  completeMessage
}
