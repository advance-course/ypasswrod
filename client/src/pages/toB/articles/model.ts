import Taro from '@tarojs/taro'
import {Model} from 'utils/dva'
import { PaginationParam, PageData, defPageData, defPaginationParams, Page, mergePagination } from 'hooks/usePagination/entity'
import { articleListApi } from 'pages/toB/articles/api'

export interface ArticleState {
  increasing: boolean,
  params: PaginationParam,
  list: PageData<article.Item>
}

export default {
  namespace: 'article',
  state: {
    increasing: false,
    params: defPaginationParams,
    list: defPageData
  },
  effects: {
    *fetchList({payload}, {call, put, select}) {
      const article: ArticleState = yield select(({article}) => article);
      const { params, list: curList } = article;
      const def: PaginationParam = payload ? { ...params, ...payload } : params;

      if (def.current && def.current > 1) {
        yield put({type: 'increasing', payload: true})
      }

      yield put({type: 'updateParams', payload: def})
      Taro.showLoading({title: '加载中...'})
      try {
        const res = yield call(articleListApi, def);
        const list: Page<article.Item> = res.data;
        const _list = mergePagination(curList!, list);
        yield put({
          type: 'updateList',
          payload: _list
        })
        Taro.hideLoading();
        Taro.stopPullDownRefresh();
      } catch (e) {
        Taro.hideLoading();
        Taro.showToast({title: e.message});
        yield put({ type: 'increasing', payload: false })
      }
    }
  },
  reducers: {
    updateList(state, action: any) {
      return {
        ...state,
        list: action.payload,
        increasing: false
      }
    }, 
    increasing(state, action: any) {
      return {
        ...state,
        increasing: action.payload
      }
    },
    updateParams(state, action: any) {
      return {
        ...state,
        params: action.payload
      }
    }
  }
} as Model<ArticleState>