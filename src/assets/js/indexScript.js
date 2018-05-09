import {GlobalViewModel, ready, AJAX_PREFIX} from '../../libs/js/global';
import '../scss/index.scss'

class ViewModel extends GlobalViewModel {
  constructor() {
    super();
    
  }
}
ready(ViewModel, () => {
  console.log('index script')
});