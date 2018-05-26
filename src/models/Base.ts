import { fetch } from 'autofetch';
import { upperFirst } from 'lodash';
import { stringify } from 'qs';

const {version} = require('../../package.json');

export namespace Props {
  export type AccessToken = string;
  export type AccessTokenId = string;

  export interface BaseProps {
    access_token: AccessToken;
    access_token_id: AccessTokenId;
  }

  export interface ClassProps extends BaseProps {
    namespace: string;
  }

  export interface RequestOptions {
    [key: string]: any;

    body: any
  }
}

fetch.callback(async (res: any) => {
  const data = await res.json();

  if (data.status && data.status.code === '1') {
    return data;
  }
  return Promise.reject(data.status.message);
});

export default class Base {
  private readonly access_token: string;
  private readonly access_token_id: string;
  private readonly namespace: string;
  private readonly token: string;

  constructor(props: Props.ClassProps) {
    this.access_token = props.access_token;
    this.access_token_id = props.access_token_id;
    this.namespace = upperFirst(props.namespace);
    this.token = [this.access_token_id, this.access_token].join(',');
  }

  protected request(name: string): Promise<any>;

  protected request(name: string, options?: Props.RequestOptions): Promise<any>;

  protected request(namespace: string, name: string, options?: Props.RequestOptions): Promise<any>;

  protected async request(namespace: string, name?: any, options?: Props.RequestOptions) {
    if (!options && namespace && typeof name === 'object') {
      options = name;
      name = namespace;
      namespace = this.namespace;
    } else if (!options && !name && namespace) {
      name = namespace;
      namespace = this.namespace;
    }

    options = options || {body: {}};

    options.method = 'POST';

    options.headers = options.headers || {};
    options.headers['user-agent'] = `dnspod.js/${version}`;
    options.headers['content-type'] = 'application/x-www-form-urlencoded';

    options.body = options.body || options.data || {};
    options.body.format = 'json';
    options.body.lang = 'cn';
    options.body.error_on_empty = 'yes';
    options.body.login_token = this.token;

    const res = await fetch(`https://dnsapi.cn/${namespace}.${upperFirst(name)}`, {
      ...options,
      body: stringify(options.body)
    });

    return res;
  }
}
