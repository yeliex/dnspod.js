import Base, { Props as BaseProps } from './Base';
import Domain, { Props as DomainProps } from './Domain';

export namespace Props {
  export type OldGrade = 'D_Free' | 'D_Plus' | 'D_Extra' | 'D_Expert' | 'D_Ultra';
  export type NewGrade = 'DP_Free' | 'DP_Plus' | 'DP_Extra' | 'DP_Expert' | 'DP_Ultra';
  export type DomainGrade = OldGrade | NewGrade;

  export interface LineProps extends DomainProps.DomainProps {
    domainGrade: DomainGrade
  }
}

export default class DomainRecord extends Base {
  constructor(props: BaseProps.BaseProps) {
    super({...props, namespace: 'Record'});
  }

  /**
   * 获取等级允许的记录类型
   * @link http://www.dnspod.cn/docs/domains.html#record-type
   * @param {Props.DomainGrade} domainGrade
   * @returns {Promise<any>}
   */
  public async Type(domainGrade: Props.DomainGrade) {
    const res = await this.request('Type', {
      body: {
        domain_grade: domainGrade
      }
    });

    return res.types;
  }

  public async Line({domain, domainGrade}: Props.LineProps) {
    const body: any = {domain_grade: domainGrade};

    if (Domain.isDomainId(domain)) {
      body.domain_id = domain;
    } else {
      body.domain = domain;
    }

    const res = await this.request('Line', {
      body
    });
    return {
      lines: res.lines,
      lineIds: res.line_ids
    };
  }
}
