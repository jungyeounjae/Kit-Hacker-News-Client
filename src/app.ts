import Router from './core/router'
import { NewsFeedView, NewsDetailView }from './page';
import Store from './store';

// 전역변수 정의 1 번째 방법
// const store: Store = {
//   currentPage: 1,
//   feeds: [],
// };

// Storeをglobal変数として登録
// declare global {
//   interface Window {
//     store: Store;
//   }
// }

//window.store = store;


// 전역변수 정의 2 번째 방법
const store = new Store();
const router: Router = new Router();
const newsFeedView = new NewsFeedView('root', store);
const newsDetailView = new NewsDetailView('root', store);

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView, /page\/(\d+)/);
router.addRoutePath('/show/', newsDetailView, /show\/(\d+)/);

// 최초 진입시에는 hashchange가 발생하지 않기 때문에 인위적으로 호출!
router.route();