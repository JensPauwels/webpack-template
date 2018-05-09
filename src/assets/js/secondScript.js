import {GlobalViewModel, ready, AJAX_PREFIX} from '../../libs/js/global';

class ViewModel extends GlobalViewModel {
  constructor() {
    super();
    
  }
}
ready(ViewModel, () => {
  console.log('second script')
});