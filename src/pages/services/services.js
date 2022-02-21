import request from '@/utils/request';
import { apiServer } from '@/utils/constants';

const api = {
  dataConnection: '/api/dataConnection',
  generator: '/api/generator',
};

export async function getDataConnections(params) {
  return request(apiServer + api.dataConnection);
}

export async function queryWhere(params) {
  return request(apiServer + api.dataConnection + '/queryWhere', {
    method: 'POST',
    body: params.queryBuilder,
  });
}

export async function testConnect(params) {
  return request(apiServer + api.dataConnection + '/testConnect', {
    method: 'POST',
    body: params.data,
  });
}

export async function save(params) {
  return request(apiServer + api.dataConnection, {
    method: 'POST',
    body: params.data,
  });
}

export async function edit(params) {
  return request(apiServer + api.dataConnection + '/' + params.data.id, {
    method: 'PUT',
    body: params.data,
  });
}

export async function findTables(params) {
  return request(apiServer + api.dataConnection + '/findTables/' + params.dataConnectionId);
}

export async function generatorSave(params) {
  return request(apiServer + api.generator, {
    method: 'POST',
    body: params.data,
  });
}

export function getApi () {
  return api;
}
