import Base, { Props as BaseProps } from './Base';
import Domain, { Props as DomainProps } from './Domain';

export namespace Props {
  export interface CreateProps {
    domainId: number,
    domain: string
  }

  export interface RemoveProps extends DomainProps.DomainProps {
    aliasId: number
  }
}

export default class DomainAlias extends Base {
  constructor(props: BaseProps.BaseProps) {
    super({...props, namespace: 'Domainalias'});
  }

  /**
   * 域名绑定列表
   * @link http://www.dnspod.cn/docs/domains.html#domainalias-list
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
    return res.alias;
  }

  /**
   * 添加域名绑定
   * @link http://www.dnspod.cn/docs/domains.html#domainalias-create
   * @param {string} domain
   * @param {number} domainId
   * @returns {Promise<any>}
   */
  public async Create({domain, domainId}: Props.CreateProps) {
    const res = await this.request('Create', {
      body: {
        domain,
        domain_id: domainId
      }
    });
    return res.alias;
  }

  /**
   * 删除域名绑定
   * @link http://www.dnspod.cn/docs/domains.html#domainalias-remove
   * @param {Props.DomainOrDomainId} domain
   * @param {number} aliasId
   * @returns {Promise<boolean>}
   */
  public async Remove({domain, aliasId}: Props.RemoveProps) {
    const body: any = {aliasId};

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
