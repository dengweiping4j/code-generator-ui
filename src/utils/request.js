import fetch from 'dva/fetch';
// import crypto from 'crypto';
// import uuidv1 from 'uuid/v1';
import router from 'umi/router';

import hash from 'hash.js';

import { loginURL } from '@/utils/constants';

import QProgress from 'qier-progress';
import { message } from 'antd';

const qprogress = new QProgress();

const csrfTokenKey = `csrfToken`;

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  console.log('response =', response);
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 422) {
    return response;
  }


  const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: `请求错误 ${response.status}: ${response.url}`,
  //   description: errortext,
  // });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    expirys: false,
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
    /*    headers: {
          'X-CSRF-TOKEN': localStorage.getItem(csrfTokenKey) || '',
        },*/
  };


  const newOptions = { ...defaultOptions, ...options };

  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  } else {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
  }

  qprogress.start();

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      return cachedSave(response, hashcode);
    })
    .then(response => response.json())
    .then(responseJSON => {
      return responseJSON;
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        message.error('登录信息已失效，请重新登录');

        if (loginURL === '/login') {
          router.push(loginURL);
        } else {
          window.location.replace(loginURL);
        }

        return;
      }

      if (status === 403) {
        console.log('##### 403');
        router.push('/403');
        return;
      }

      if (status <= 504 && status >= 500) {
        router.push('/500');
        return;
      }

      if (status >= 404 && status < 422) {
        router.push('/404');
        return;
      }
    })
    .finally(() => {
      qprogress.finish();
    });
}
