import * as services from './services/services';

export default {
  namespace: 'generator',

  state: {
  },

  effects: {
    /**
     * 获取所有数据源
     * @param payload
     * @param callback
     * @param call
     * @returns {Generator<*, void, *>}
     */
    * getDataConnections({ payload, callback }, { call }) {
      const result = yield call(services.getDataConnections, payload);
      if (callback && typeof callback === 'function') {
        callback(result);
      }
    },

    /**
     * 条件查询
     * @param payload
     * @param put
     * @param call
     * @returns {Generator<*, void, *>}
     */
    * queryWhere({ callback, payload }, { put, call }) {
      const result = yield call(services.queryWhere, payload);
      if (callback && typeof callback === 'function') {
        callback(result);
      }
    },

    /**
     * 测试连接
     * @param payload
     * @param callback
     * @param put
     * @param call
     * @returns {Generator<*, void, *>}
     */
    * testConnect({ payload, callback }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {
          testLoading: true,
        },
      });
      const result = yield call(services.testConnect, payload);
      if (callback && typeof callback === 'function') {
        callback(result);
      }
    },

    /**
     * 保存
     * @param payload
     * @param callback
     * @param call
     * @returns {Generator<*, void, *>}
     */
    * save({ payload, callback }, { call }) {
      const result = yield call(services.save, payload);
      if (callback && typeof callback === 'function') {
        callback(result);
      }
    },

    /**
     * 修改
     * @param payload
     * @param callback
     * @param call
     * @returns {Generator<*, void, *>}
     */
    * edit({ payload, callback }, { call }) {
      const result = yield call(services.edit, payload);
      if (callback && typeof callback === 'function') {
        callback(result);
      }
    },

    /**
     * 根据数据源ID查询表列表
     * @param payload
     * @param callback
     * @param call
     * @returns {Generator<*, void, *>}
     */
    * findTables({ payload, callback }, { call }) {
      const result = yield call(services.findTables, payload);
      if (callback && typeof callback === 'function') {
        callback(result);
      }
    },

    * generatorSave({ payload, callback }, { call }) {
      const result = yield call(services.generatorSave, payload);
      if (callback && typeof callback === 'function') {
        callback(result);
      }
    },

  },

  reducers: {

    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

  },

};