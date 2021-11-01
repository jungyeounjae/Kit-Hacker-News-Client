import Router from './core/router'
import { NewsFeedView, NewsDetailView }from './page';
import { Store } from './types'

const store: Store = {
  currentPage: 1,
  feeds: [],
};

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

// 최초 진입시에는 hashchange가 발생하지 않기 때문에 인위적으로 호출!
router.route();