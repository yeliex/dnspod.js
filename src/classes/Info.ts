import Base, { Props } from './Base';

export default class Info extends Base {
  constructor(props: Props.BaseProps) {
    super({...props, namespace: 'Info'});
  }

  public async Version() {
    const res = await this.request('Version');
    return res.status.message;
  }
}