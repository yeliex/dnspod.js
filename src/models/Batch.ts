import Base, { Props as BaseProps } from './Base';
import { Props as RecordProps } from './Record';

export namespace Props {
  export interface DomainCreateProps {
    domains: string[] | string,
    revordValue?: string
  }

  export interface RecordCreateProps {
    domainId: number[] | number,
    records: RecordProps.Record | RecordProps.Record[]
  }

  export interface RecordModifyProps {
    recordId: number[] | number;
    change: 'sub_domain' | 'record_type' | 'area' | 'value' | 'mx' | 'ttl' | 'status';
    changeTo: string | number | RecordProps.RecordType | RecordProps.MX | RecordProps.RecordStatus;
    value?: any;
    mx?: RecordProps.MX
  }
}

export default class Batch extends Base {
  constructor(props: BaseProps.BaseProps) {
    super({...props, namespace: 'Batch'});
  }

  get Domain() {
    return {
      /**
       * 批量添加域名
       * @link http://www.dnspod.cn/docs/batch.html#batch-domain-create
       * @param {string[]} domains
       * @param {string} revordValue
       * @returns {Promise<any>}
       */
      Create: async ({domains, revordValue}: Props.DomainCreateProps) => {
        domains = Array.isArray(domains) ? domains : [domains];
        const res = await this.request('Domain.Create', {
          data: {
            domains: domains.join(','),
            record_value: revordValue
          }
        });

        return {
          id: res.job_id,
          detail: res.detail
        };
      }
    };
  }

  get Record() {
    return {
      /**
       * 批量添加记录
       * @link http://www.dnspod.cn/docs/batch.html#batch-record-create
       * @param {string[] | string} domainId
       * @param {Props.Record | Props.Record[]} records
       * @returns {Promise<{id: any; detail: any}>}
       */
      Create: async ({domainId, records}: Props.RecordCreateProps) => {
        domainId = Array.isArray(domainId) ? domainId : [domainId];
        records = Array.isArray(records) ? records : [records];

        const res = await this.request('Record.Create', {
          data: {
            domain_id: domainId.join(','),
            records: JSON.stringify(records)
          }
        });

        return {
          id: res.job_id,
          detail: res.detail
        };
      },
      /**
       * 批量修改记录
       * @link http://www.dnspod.cn/docs/batch.html#batch-record-modify
       * @param {number[] | number} recordId
       * @param {"sub_domain" | "record_type" | "area" | "value" | "mx" | "ttl" | "status"} change
       * @param {string | number | Props.RecordType | Props.MX | Props.RecordStatus} changeTo
       * @param {any} value
       * @param {Props.MX} mx
       * @returns {Promise<any>}
       */
      Modify: async ({recordId, change, changeTo, value, mx}: Props.RecordModifyProps) => {
        recordId = Array.isArray(recordId) ? recordId : [recordId];

        const res = await this.request('Record.Create', {
          data: {
            record_id: recordId.join(','),
            change,
            change_to: changeTo,
            value,
            mx
          }
        });

        return {
          id: res.job_id,
          detail: res.detail
        };
      }
    };
  }

  /**
   * 获取任务详情
   * @link http://www.dnspod.cn/docs/batch.html#batch-detail
   * @param {number} id
   * @returns {Promise<any>}
   */
  public async Detail(id: number) {
    const res = await this.request('Detail', {
      data: {
        job_id: id
      }
    });

    return res.detial;
  }
}
