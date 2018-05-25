import Base, { Props as BaseProps } from './Base';

export namespace Props {
  export interface CreateProps {
    domain: string;
    groupId?: string;
    mark?: string;
  }

  export type DomainType = 'all' | 'mine' | 'share' | 'ismark' | 'pause' | 'vip' | 'recent' | 'share_out';

  export type DomainOrDomainId = string | number;

  export interface ListProps {
    type?: DomainType;
    offset?: number,
    length?: number,
    groupId?: string,
    keyword?: string
  }
}

export default class Domain extends Base {
  constructor(props: BaseProps.BaseProps) {
    super({...props, namespace: 'Domain'});
  }

  public async Create({domain, groupId, mark}: Props.CreateProps) {
    const res = await this.request('Create', {
      body: {
        domain,
        group_id: groupId,
        is_mark: mark
      }
    });
    return res.domain;
  }

  public async List({type, offset, groupId, keyword, length}: Props.ListProps = {}) {
    const res = await this.request('List', {
      body: {
        type,
        offset,
        group_id: groupId,
        keyword,
        length
      }
    });

    return {
      info: res.info,
      list: res.domains
    };
  }

  public async Remove(domain: Props.DomainOrDomainId) {
    const body: any = {};

    if (typeof domain === 'number' || !Number.isNaN(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Remove', {
      body
    });
    return true;
  }

  public async Status({}) {

  }
}