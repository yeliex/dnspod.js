import { Props as BaseProps } from './classes/Base';
import Info from './classes/Info';
import User from './classes/User';

export namespace Props {
  export interface DNSPodProps extends BaseProps.BaseProps {
    namespace: never
  }
}

export default class DNSPod {
  public readonly Info: Info;
  public readonly User: User;

  constructor(props: Props.DNSPodProps) {
    this.Info = new Info(props);
    this.User = new User(props);
  }
}
