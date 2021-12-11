import { NewsFeed, NewsStore } from './types';

export default class Store implements NewsStore{
    private feeds: NewsFeed[];
    private _currentPage: number;

    constructor() {
        this.feeds = [];
        this._currentPage = 1;
    }

    // getter() - 외부에서는 속성으로 보이기 때문에 get set 을 실시하고 싶은 경우, 대입문으로 값을 세팅 할 수 있다.(읽을 때는 속성값으로 읽을 수 있다.)
    get currentPage() {
        return this._currentPage;
    }

    //setter()
    set currentPage(page: number) {
        this._currentPage = page;
    }

    get nextPage(): number {
        return this._currentPage + 1;
    }

    get prevPage(): number {
        return this._currentPage > 1 ? this._currentPage - 1 : 1;
    }

    get numberOfFeed(): number {
        return this.feeds.length;
    }

    get hasFeeds(): boolean {
        return this.feeds.length > 0;
    }

    getAllFeeds(): NewsFeed[] {
        return this.feeds;
    }

    getFeed(position: number): NewsFeed {
        return this.feeds[position];
    }

    setFeeds(feeds: NewsFeed[]): void {
        this.feeds = feeds.map(feed => ({
            ...feed,
            read: false
        }))
    }

    makeRead(id: number): void {
        // findは es6環境で動く
        const feed = this.feeds.find((feed: NewsFeed) => feed.id === id);

        if (feed) {
            feed.read = true;
        }
    }
}

class test {
    private s1 = new Store();
    private v = 1;

    constructor() {
        // setter
        this.s1.currentPage = 1;
        //getter
        this.v = this.s1.nextPage;
    }

}