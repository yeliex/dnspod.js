import Base, { Props } from './Base';

export default class Info extends Base {
  constructor(props: Props.BaseProps) {
    super({...props, namespace: 'Info'});
  }

  /**
   * 获取API版本号
   * @link http://www.dnspod.cn/docs/info.html#info-version
   * @returns {Promise<string>}
   */
  public async Version() {
    const res = await this.request('Version');
    return res.status.message;
  }
}
