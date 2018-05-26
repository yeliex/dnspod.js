import Base, { Props as BaseProps } from './Base';
import Domain, { Props as DomainProps } from './Domain';

export namespace Props {
  export type ShareType = 'r' | 'rw';

  export interface CreateProps extends DomainProps.DomainProps {
    email: string;
    mode?: ShareType;
    subDomain?: string;
  }

  export interface ModifyProps extends DomainProps.DomainProps {
    email: string,
    mode?: ShareType,
    subDomain?: string,
    oldSubDomain?: string,
    newSubDomain?: string
  }

  export interface RemoveProps extends DomainProps.DomainProps {
    email: string
  }
}

export default class DomainShare extends Base {
  constructor(props: BaseProps.BaseProps) {
    super({...props, namespace: 'Domainshare'});
  }

  /**
   * 添加域名共享
   * @link http://www.dnspod.cn/docs/domains.html#domainshare-create
   * @param {Props.DomainOrDomainId} domain
   * @param {string} email
   * @param {Props.ShareType} mode
   * @param {string} subDomain
   * @returns {Promise<boolean>}
   */
  public async Create({domain, email, mode, subDomain}: Props.CreateProps) {
    const body: any = {email, mode, sub_domain: subDomain};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Create', {
      body
    });
    return true;
  }

  /**
   * 域名共享列表
   * @link http://www.dnspod.cn/docs/domains.html#domainshare-list
   * @param {Props.DomainOrDomainId} domain
   * @returns {Promise<any>}
   */
  public async List(domain: DomainProps.DomainOrDomainId) {
    const body: any = {};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    const res = await this.request('List', {
      body
    });
    return {
      share: res.share,
      owner: res.owner
    };
  }

  /**
   * 修改域名共享
   * @link http://www.dnspod.cn/docs/domains.html#domainshare-modify
   * @param {Props.DomainOrDomainId} domain
   * @param {string} email
   * @param {Props.ShareType} mode
   * @param {string} subDomain
   * @param {string} newSubDomain
   * @param {string} oldSubDomain
   * @returns {Promise<boolean>}
   */
  public async Modify({domain, email, mode, subDomain, newSubDomain, oldSubDomain}: Props.ModifyProps) {
    const body: any = {
      email,
      mode,
      sub_domain: subDomain,
      new_sub_domain: newSubDomain,
      old_sub_domain: oldSubDomain
    };

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Modify', {
      body
    });
    return true;
  }

  /**
   * 删除域名共享
   * @link http://www.dnspod.cn/docs/domains.html#domainshare-remove
   * @param {Props.DomainOrDomainId} domain
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  public async Remove({domain, email}: Props.RemoveProps) {
    const body: any = {email};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Remove', {
      body
    });
    return true;
  }
}
