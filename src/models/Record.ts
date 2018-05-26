import Base, { Props as BaseProps } from './Base';
import Domain, { Props as DomainProps } from './Domain';

export namespace Props {
  export type RecordType = 'A' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'AAAA' | 'SRV' | 'PTR' | 'HINFO' | 'TTL';

  export type MX = [1, 20];

  export type RecordStatus = 'enable' | 'disable';

  export interface RecordBase {
    subDomain?: string;
    recordLine?: string;
    recordLineId?: string;
    value: string;
  }

  export interface Record extends RecordBase {
    recordType: RecordType;
    mx: MX;
    ttl: number;
    status: RecordStatus;
    weight?: number;
  }

  export interface RecordProps extends DomainProps.DomainProps {
    recordId: number;
  }

  export interface CreateProps extends Record, DomainProps.DomainProps {

  }

  export interface ListProps extends DomainProps.DomainProps {
    offset?: number;
    length?: number;
    subDomain?: string;
    keyword?: string;
  }

  export interface ModifyProps extends Record, RecordProps {
  }

  export interface RemoveProps extends RecordProps {
  }

  export interface DDNSProps extends RecordBase, RecordProps {
  }

  export interface RemarkProps extends RecordProps {
    remark: string;
  }

  export interface StatusProps extends RecordProps {
    status: RecordStatus
  }
}

export default class Record extends Base {
  constructor(props: BaseProps.BaseProps) {
    super({...props, namespace: 'Record'});
  }

  /**
   * 添加记录
   * @link http://www.dnspod.cn/docs/records.html#record-create
   * @param {Props.CreateProps} props
   * @returns {Promise<any>}
   */
  public async Create(props: Props.CreateProps) {
    const body: any = {
      sub_domain: props.subDomain,
      record_type: props.recordType,
      record_line: props.recordLine,
      record_line_id: props.recordLineId,
      value: props.value,
      mx: props.mx,
      ttl: props.ttl,
      status: props.status,
      weight: props.weight
    };

    if (Domain.isDomainId(props.domain)) {
      body.domain_id = props.domain;
    } else {
      body.domain = props.domain;
    }

    const res = await this.request('Create', {body});

    return res.record;
  }

  /**
   * 记录列表
   * @link http://www.dnspod.cn/docs/records.html#record-list
   * @param {Props.DomainOrDomainId} domain
   * @param {string} subDomain
   * @param {number} offset
   * @param {string} keyword
   * @param {number} length
   * @returns {Promise<any>}
   */
  public async List({domain, subDomain, offset, keyword, length}: Props.ListProps) {
    const body: any = {
      sub_domain: subDomain,
      offset,
      keyword,
      length
    };

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    const res = await this.request('List', {body});

    return {
      domain: res.domain,
      info: res.info,
      list: res.records
    };
  }

  /**
   * 修改记录
   * @link http://www.dnspod.cn/docs/records.html#record-modify
   * @param {Props.ModifyProps} props
   * @returns {Promise<any>}
   */
  public async Modify(props: Props.ModifyProps) {
    const body: any = {
      record_id: props.recordId,
      sub_domain: props.subDomain,
      record_type: props.recordType,
      record_line: props.recordLine,
      record_line_id: props.recordLineId,
      value: props.value,
      mx: props.mx,
      ttl: props.ttl,
      status: props.status,
      weight: props.weight
    };

    if (Domain.isDomainId(props.domain)) {
      body.domain_id = props.domain;
    } else {
      body.domain = props.domain;
    }

    const res = await this.request('Modify', {body});

    return res.record;
  }

  /**
   * 删除记录
   * @link http://www.dnspod.cn/docs/records.html#record-remove
   * @param {Props.DomainOrDomainId} domain
   * @param {number} recordId
   * @returns {Promise<boolean>}
   */
  public async Remove({domain, recordId}: Props.RemoveProps) {
    const body: any = {record_id: recordId};


    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Remove', {body});

    return true;
  }

  /**
   * 更新动态DNS记录
   * @link http://www.dnspod.cn/docs/records.html#dns
   * @param {Props.DomainOrDomainId} domain
   * @param {string} subDomain
   * @param {number} recordId
   * @param {string} recordLine
   * @param {string} recordLineId
   * @param {string} value
   * @returns {Promise<any>}
   */
  public async DDNS({domain, subDomain, recordId, recordLine, recordLineId, value}: Props.DDNSProps) {
    const body: any = {
      sub_domain: subDomain,
      record_id: recordId,
      record_line: recordLine,
      record_line_id: recordLineId,
      value
    };

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    const res = await this.request('Ddns', {body});

    return res.record;
  }

  /**
   * 设置记录备注
   * @link http://www.dnspod.cn/docs/records.html#record-remark
   * @param {Props.DomainOrDomainId} domain
   * @param {string} remark
   * @param {number} recordId
   * @returns {Promise<any>}
   */
  public async Remark({domain, remark, recordId}: Props.RemarkProps) {
    const body: any = {
      record_id: recordId,
      remark
    };

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    await this.request('Remark', {body});

    return true;
  }

  /**
   * 获取记录信息
   * @link http://www.dnspod.cn/docs/records.html#record-info
   * @param {Props.DomainOrDomainId} domain
   * @param {number} recordId
   * @returns {Promise<any>}
   */
  public async Info({domain, recordId}: Props.RecordProps) {
    const body: any = {
      record_id: recordId
    };

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    const res = await this.request('Info', {body});

    return {record: res.record, domain: res.domain};
  }

  /**
   * 设置记录状态
   * @link http://www.dnspod.cn/docs/records.html#record-status
   * @param {Props.DomainOrDomainId} domain
   * @param {number} recordId
   * @param {Props.RecordStatus} status
   * @returns {Promise<any>}
   */
  public async Status({domain, recordId, status}: Props.StatusProps) {
    const body: any = {record_id: recordId, status};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    const res = await this.request('Status', {body});

    return res.record;
  }
}
