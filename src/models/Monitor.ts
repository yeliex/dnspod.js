import Base, { Props as BaseProps } from './Base';
import Domain, { Props as DomainProps } from './Domain';

export namespace Props {
  export type NoticeTarget = 'me' | 'share';

  export interface ListsubvalueProps extends DomainProps.DomainProps {
    subDomain: string;
  }

  export interface Monitor {
    port: number;
    monitorInterval: 60 | 180 | 360;
    host: string;
    monitorType: 'http' | 'https';
    monitorPath: string;
    points: string[];
    bakIp: 'pass' | 'pause' | 'pause2' | 'auto' | string[];
    keepTTL?: 'yes' | 'no';
    smsNotice?: NoticeTarget | NoticeTarget[];
    emailNotice?: NoticeTarget | NoticeTarget[];
    lessNotice?: 'yes' | 'no';
    callbackUrl?: string;
    callbackKey?: string;
  }

  export interface CreateProps extends Monitor {
    domainId: number;
    recordId: number;
  }

  export interface ModifyProps extends Monitor {
    monitorId: string;
  }

  export interface SetstatusProps {
    monitorId: string;
    status: 'enabled' | 'disabled';
  }

  export interface GethistoryProps {
    monitorId: string;
    hours?: number;
  }

  export interface GetDownProps {
    offset?: number;
    length?: number;
  }
}

export default class Monitor extends Base {
  constructor(props: BaseProps.BaseProps) {
    super({...props, namespace: 'Monitor'});
  }

  /**
   * 列出包含A记录的子域名
   * @link http://www.dnspod.cn/docs/d-monitor.html#a
   * @param {Props.DomainOrDomainId} domain
   * @returns {Promise<any>}
   */
  public async Listsubdomain(domain: DomainProps.DomainOrDomainId) {
    const data: any = {};

    if (Domain.isDomainId(domain)) {
      data.domain_id = domain;
    } else {
      data.domain = domain;
    }

    const res = await this.request('Listsubdomain', {data});

    return {
      domain: res.domain,
      list: res.subdomain
    };
  }

  /**
   * 列出子域名的A记录
   * @link http://www.dnspod.cn/docs/d-monitor.html#monitor-listsubvalue
   * @param {Props.DomainOrDomainId} domain
   * @param {string} subDomain
   * @returns {Promise<any>}
   */
  public async Listsubvalue({domain, subDomain}: Props.ListsubvalueProps) {
    const data: any = {sub_domain: subDomain};

    if (Domain.isDomainId(domain)) {
      data.domain_id = domain;
    } else {
      data.domain = domain;
    }

    const res = await this.request('Listsubvalue', {data});

    return {
      domain: res.domain,
      points: res.points,
      records: res.records
    };
  }

  /**
   * 监控列表
   * @link http://www.dnspod.cn/docs/d-monitor.html#monitor-list
   * @returns {Promise<any>}
   */
  public async List() {
    const res = await this.request('List');

    return {
      info: res.info,
      list: res.list
    };
  }

  /**
   * 监控添加
   * @link http://www.dnspod.cn/docs/d-monitor.html#monitor-create
   * @param {Props.CreateProps} props
   * @returns {Promise<any>}
   */
  public async Create(props: Props.CreateProps) {
    const res = await this.request('List', {
      data: {
        domain_id: props.domainId,
        record_id: props.recordId,
        port: props.port,
        monitor_interval: props.monitorInterval,
        host: props.host,
        monitor_type: props.monitorType,
        monitor_path: props.monitorPath,
        points: props.points,
        bak_ip: Array.isArray(props.bakIp) ? props.bakIp.join(',') : props.bakIp,
        keep_ttl: props.keepTTL,
        sms_notice: Array.isArray(props.smsNotice) ? props.smsNotice.join(',') : props.smsNotice,
        email_notice: Array.isArray(props.emailNotice) ? props.emailNotice.join(',') : props.emailNotice,
        less_notice: props.lessNotice,
        callback_url: props.callbackKey,
        callback_key: props.callbackKey
      }
    });

    return res.monitor;
  }

  /**
   * 监控修改
   * @link http://www.dnspod.cn/docs/d-monitor.html#monitor-modify
   * @param {Props.ModifyProps} props
   * @returns {Promise<any>}
   */
  public async Modify(props: Props.ModifyProps) {
    await this.request('Modify', {
      data: {
        monitor_id: props.monitorId,
        port: props.port,
        monitor_interval: props.monitorInterval,
        host: props.host,
        monitor_type: props.monitorType,
        monitor_path: props.monitorPath,
        points: props.points,
        bak_ip: Array.isArray(props.bakIp) ? props.bakIp.join(',') : props.bakIp,
        keep_ttl: props.keepTTL,
        sms_notice: Array.isArray(props.smsNotice) ? props.smsNotice.join(',') : props.smsNotice,
        email_notice: Array.isArray(props.emailNotice) ? props.emailNotice.join(',') : props.emailNotice,
        less_notice: props.lessNotice,
        callback_url: props.callbackKey,
        callback_key: props.callbackKey
      }
    });

    return true;
  }

  /**
   * 监控删除
   * @link http://www.dnspod.cn/docs/d-monitor.html#monitor-remove
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  public async Remove(id: string) {
    await this.request('Remove', {
      data: {
        monitor_id: id
      }
    });

    return true;
  }

  /**
   * 获取监控信息
   * @link http://www.dnspod.cn/docs/d-monitor.html#monitor-info
   * @param {string} id
   * @returns {Promise<any>}
   */
  public async Info(id: string) {
    const res = await this.request('Info', {
      data: {
        monitor_id: id
      }
    });

    return res.info;
  }

  /**
   * 设置监控状态
   * @link http://www.dnspod.cn/docs/d-monitor.html#monitor-setstatus
   * @param {string} monitorId
   * @param {"enabled" | "disabled"} status
   * @returns {Promise<boolean>}
   */
  public async Setstatus({monitorId, status}: Props.SetstatusProps) {
    await this.request('Setstatus', {
      data: {
        monitor_id: monitorId,
        status
      }
    });

    return true;
  }

  /**
   * @alias Setstatus
   */
  public Status = this.Setstatus;

  /**
   * 获取监控历史
   * @link http://www.dnspod.cn/docs/d-monitor.html#monitor-gethistory
   * @param {string} monitorId
   * @param {number} hours
   * @returns {Promise<any>}
   */
  public async Gethistory({monitorId, hours}: Props.GethistoryProps) {
    const res = await this.request('Gethistory', {
      data: {
        monitor_id: monitorId,
        hours
      }
    });

    return {
      domain: res.domain,
      record: res.record,
      list: res.monitor_history
    };
  }

  /**
   * @alias Gethistory
   */
  public History = this.Gethistory;

  /**
   * 获取监控概况
   * @link http://www.dnspod.cn/docs/d-monitor.html#monitor-userdesc
   * @returns {Promise<any>}
   */
  public async Userdesc() {
    const res = await this.request('Userdesc');

    return {
      desc: res.desc,
      user: res.user
    };
  }

  /**
   * @alias Userdesc
   */
  public Desc = this.Userdesc;

  /**
   * 获取监控警告
   * @link http://www.dnspod.cn/docs/d-monitor.html#monitor-getdowns
   * @param {number} offset
   * @param {number} length
   * @returns {Promise<any>}
   */
  public async Getdowns({offset, length}: Props.GetDownProps) {
    const res = await this.request('Userdesc', {
      data: {
        offset, length
      }
    });

    return {
      info: res.info,
      list: res.monitor_downs
    };
  }

  /**
   * @alias Getdowns
   */
  public Warning = this.Getdowns;
}
