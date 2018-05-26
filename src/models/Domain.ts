import Base, { Props as BaseProps } from './Base';
import DomainShare from './Domain.Share';
import DomainAlias from './Domain.Alias';
import DomainGroup from './Domain.Group';
import DomainRecord from './Domain.Record';

export namespace Props {
  export interface CreateProps {
    domain: string;
    groupId?: string;
    mark?: string;
  }

  export type DomainType = 'all' | 'mine' | 'share' | 'ismark' | 'pause' | 'vip' | 'recent' | 'share_out';

  export type DomainOrDomainId = string | number;

  export type DomainStatus = 'enable' | 'disable';

  export type SearchenginepushStatus = 'yes' | 'no';

  export type MarkStatus = 'yes' | 'no';

  export interface DomainProps {
    domain: DomainOrDomainId
  }

  export interface ListProps {
    type?: DomainType;
    offset?: number;
    length?: number;
    groupId?: string;
    keyword?: string;
  }

  export interface StatusProps extends DomainProps {
    status: DomainStatus
  }

  export interface LogProps extends DomainProps {
    offset?: number;
    length?: number
  }

  export interface SearchenginepushProps extends DomainProps {
    status: SearchenginepushStatus
  }

  export interface TransferProps extends DomainProps {
    email: string
  }

  export interface LockProps extends DomainProps {
    days: number
  }

  export interface UnlockProps extends DomainProps {
    lockCode: string
  }

  export interface MarkProps extends DomainProps {
    mark: MarkStatus
  }

  export interface RemarkProps extends DomainProps {
    remark: string
  }

  export interface AcquiresendProps {
    domain: string;
    email: string;
  }

  export interface AcquirevalidateProps {
    domain: string;
    code: number;
  }
}

export default class Domain extends Base {
  public static get isDomainId() {
    return (input: Props.DomainOrDomainId) => {
      return !!(typeof input === 'number' && !isNaN(Number(input)));
    };
  }

  public readonly DomainShare: DomainShare;
  public readonly DomainAlias: DomainAlias;
  public readonly DomainGroup: DomainGroup;
  public readonly DomainRecord: DomainRecord;

  constructor(props: BaseProps.BaseProps) {
    super({...props, namespace: 'Domain'});

    this.DomainShare = new DomainShare(props);
    this.DomainAlias = new DomainAlias(props);
    this.DomainGroup = new DomainGroup(props);
    this.DomainRecord = new DomainRecord(props);
  }

  /**
   * 添加新域名
   * @link http://www.dnspod.cn/docs/domains.html#domain-create
   * @param {string} domain
   * @param {string} groupId
   * @param {string} mark
   * @returns {Promise<any>}
   */
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

  /**
   * 获取域名列表
   * @link http://www.dnspod.cn/docs/domains.html#domain-list
   * @param {Props.DomainType} type
   * @param {number} offset
   * @param {string} groupId
   * @param {string} keyword
   * @param {number} length
   * @returns {Promise<any>}
   */
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

  /**
   * 删除域名
   * @link http://www.dnspod.cn/docs/domains.html#domain-remove
   * @param {Props.DomainOrDomainId} domain
   * @returns {Promise<boolean>}
   */
  public async Remove(domain: Props.DomainOrDomainId) {
    const body: any = {};

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

  /**
   * 设置域名状态
   * @param {Props.DomainOrDomainId} domain
   * @param {Props.DomainStatus} status
   * @returns {Promise<boolean>}
   */
  public async Status({domain, status}: Props.StatusProps) {
    const body: any = {status};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Status', {
      body
    });
    return true;
  }

  /**
   * 获取域名信息
   * @link http://www.dnspod.cn/docs/domains.html#domain-info
   * @param {Props.DomainOrDomainId} domain
   * @returns {Promise<any>}
   */
  public async Info(domain: Props.DomainOrDomainId) {
    const body: any = {};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    const res = await this.request('Info', {
      body
    });
    return res.domain;
  }

  /**
   * 获取域名日志
   * @link http://www.dnspod.cn/docs/domains.html#domain-log
   * @param {Props.DomainOrDomainId} domain
   * @param {number} offset
   * @param {number} length
   * @returns {Promise<any>}
   */
  public async Log({domain, offset, length}: Props.LogProps) {
    const body: any = {offset, length};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    const res = await this.request('Log', {
      body
    });
    return res.log;
  }

  /**
   * 设置搜索引擎推送
   * @link http://www.dnspod.cn/docs/domains.html#domain-searchenginepush
   * @param {Props.DomainOrDomainId} domain
   * @param {Props.SearchenginepushStatus} status
   * @returns {Promise<boolean>}
   */
  public async Searchenginepush({domain, status}: Props.SearchenginepushProps) {
    const body: any = {status};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Searchenginepush', {
      body
    });
    return true;
  }

  /**
   * 域名过户
   * @link http://www.dnspod.cn/docs/domains.html#domain-transfer
   * @param {Props.DomainOrDomainId} domain
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  public async Transfer({domain, email}: Props.TransferProps) {
    const body: any = {email};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Transfer', {
      body
    });
    return true;
  }

  /**
   * 锁定域名
   * @link http://www.dnspod.cn/docs/domains.html#domain-lock
   * @param {Props.DomainOrDomainId} domain
   * @param {number} days
   * @returns {Promise<any>}
   */
  public async Lock({domain, days}: Props.LockProps) {
    const body: any = {days};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    const res = await this.request('Lock', {
      body
    });
    return res.lock;
  }

  /**
   * 域名锁定解锁
   * @link http://www.dnspod.cn/docs/domains.html#domain-unlock
   * @param {Props.DomainOrDomainId} domain
   * @param {string} lockCode
   * @returns {Promise<boolean>}
   */
  public async Unlock({domain, lockCode}: Props.UnlockProps) {
    const body: any = {lock_code: lockCode};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Unlock', {
      body
    });
    return true;
  }

  /**
   * 设置域名星标
   * @link http://www.dnspod.cn/docs/domains.html#domain-ismark
   * @param {Props.DomainOrDomainId} domain
   * @param {Props.MarkStatus} mark
   * @returns {Promise<boolean>}
   */
  public async Ismark({domain, mark}: Props.MarkProps) {
    const body: any = {is_mark: mark};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Ismark', {
      body
    });
    return true;
  }

  /**
   * 设置域名备注
   * @link http://www.dnspod.cn/docs/domains.html#domain-remark
   * @param {Props.DomainOrDomainId} domain
   * @param {string} remark
   * @returns {Promise<boolean>}
   */
  public async Remark({domain, remark}: Props.RemarkProps) {
    const body: any = {remark};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Remark', {
      body
    });
    return true;
  }

  /**
   * 获取域名权限
   * @link http://www.dnspod.cn/docs/domains.html#domain-purview
   * @param {Props.DomainOrDomainId} domain
   * @returns {Promise<any>}
   */
  public async Purview(domain: Props.DomainOrDomainId) {
    const body: any = {};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    const res = await this.request('Purview', {
      body
    });
    return res.purview;
  }

  /**
   * 域名取回获取 WHOIS 邮箱列表
   * @link http://www.dnspod.cn/docs/domains.html#whois
   * @param {string} domain
   * @returns {Promise<any>}
   */
  public async Acquire(domain: string) {
    const res = await this.request('Acquire', {
      body: {domain}
    });

    return res.emails;
  }

  /**
   * 域名取回发送验证码
   * @deprecated
   * @link http://www.dnspod.cn/docs/domains.html#domain-acquiresend
   * @param {string} domain
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  public async Acquiresend({domain, email}: Props.AcquiresendProps) {
    await this.request('Acquiresend', {
      body: {domain, email}
    });

    return true;
  }

  /**
   * 验证域名取回的验证码
   * @link http://www.dnspod.cn/docs/domains.html#domain-acquirevalidate
   * @param {string} domain
   * @param {number} code
   * @returns {Promise<boolean>}
   * @constructor
   */
  public async Acquirevalidate({domain, code}: Props.AcquirevalidateProps) {
    await this.request('Acquirevalidate', {
      body: {domain, code}
    });

    return true;
  }

  /**
   * 域名取回发送验证链接
   * @link http://www.dnspod.cn/docs/domains.html#domain-acquiresend-new
   * @param {string} domain
   * @param {string} email
   * @returns {Promise<boolean>}
   * @constructor
   */
  public async AcquiresendLink({domain, email}: Props.AcquiresendProps) {
    await this.request('Acquiresend.New', {
      body: {domain, whois_email: email}
    });

    return true;
  }
}
