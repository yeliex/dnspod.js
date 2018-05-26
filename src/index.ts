import { Props as BaseProps } from './models/Base';
import Info from './models/Info';
import User from './models/User';
import Domain from './models/Domain';
import Record from './models/Record';
import Batch from './models/Batch';

export namespace Props {
  export interface DNSPodProps extends BaseProps.BaseProps {
    namespace: never
  }
}

export default class DNSPod {
  public readonly Info: Info;
  public readonly User: User;
  public readonly Domain: Domain;
  public readonly Record: Record;
  public readonly Batch: Batch;

  constructor(props: Props.DNSPodProps) {
    this.Info = new Info(props);
    this.User = new User(props);
    this.Domain = new Domain(props);
    this.Record = new Record(props);
    this.Batch = new Batch(props);
  }
}
