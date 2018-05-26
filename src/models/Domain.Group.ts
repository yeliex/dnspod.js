import Base, { Props as BaseProps } from './Base';
import Domain, { Props as DomainProps } from './Domain';

export namespace Props {
  export interface ModifyProps {
    groupName: string,
    groupId: number
  }

  export interface ChangegroupProps extends DomainProps.DomainProps {
    groupId: number
  }
}

export default class DomainGroup extends Base {
  constructor(props: BaseProps.BaseProps) {
    super({...props, namespace: 'Domaingroup'});
  }

  /**
   * 获取域名分组
   * @link http://www.dnspod.cn/docs/domains.html#domaingroup-list
   * @returns {Promise<any>}
   */
  public async List() {
    const res = await this.request('List');
    return res.groups;
  }

  /**
   * 添加域名分组
   * @link http://www.dnspod.cn/docs/domains.html#domaingroup-create
   * @returns {Promise<any>}
   * @param groupName
   */
  public async Create(groupName: string) {
    const res = await this.request('Create', {
      body: {
        group_name: groupName
      }
    });
    return res.groups;
  }

  /**
   * 修改域名分组
   * @link http://www.dnspod.cn/docs/domains.html#domaingroup-modify
   * @param {number} groupId
   * @param {string} groupName
   * @returns {Promise<boolean>}
   */
  public async Modify({groupId, groupName}: Props.ModifyProps) {
    await this.request('Modify', {
      body: {
        group_name: groupName,
        group_id: groupId
      }
    });
    return true;
  }

  /**
   * 删除域名分组
   * @link http://www.dnspod.cn/docs/domains.html#domaingroup-remove
   * @param groupId
   * @returns {Promise<boolean>}
   */
  public async Remove(groupId: number) {
    await this.request('Remove', {
      body: {
        group_id: groupId
      }
    });
    return true;
  }

  /**
   * 设置域名分组
   * @link http://www.dnspod.cn/docs/domains.html#domain-changegroup
   * @param {Props.DomainOrDomainId} domain
   * @param {number} groupId
   * @returns {Promise<boolean>}
   */
  public async Changegroup({domain, groupId}: Props.ChangegroupProps) {
    const body: any = {group_id: groupId};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Changegroup', {
      body
    });
    return true;
  }
}
