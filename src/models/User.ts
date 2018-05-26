import Base, { Props as BaseProps } from './Base';

export namespace Props {
  export interface ModifyProps {
    realName?: string,
    nick?: string,
    telephone?: string
  }

  export interface PasswordModifyProps {
    oldPassword: string,
    newPassword: string
  }

  export interface EmailModifyProps {
    oldEmail: string,
    newEmail: string,
    password: string
  }
}

export default class User extends Base {
  constructor(props: BaseProps.BaseProps) {
    super({...props, namespace: 'User'});
  }

  /**
   * 获取帐户信息
   * @link http://www.dnspod.cn/docs/accounts.html#user-detail
   * @returns {Promise<any>}
   */
  public async Detail() {
    const res = await this.request('Detail');
    return res.info.user;
  }

  /**
   * 修改资料
   * @link http://www.dnspod.cn/docs/accounts.html#user-modify
   * @param {string} realName
   * @param {string} nick
   * @param {string} telephone
   * @returns {Promise<boolean>}
   */
  public async Modify({realName, nick, telephone}: Props.ModifyProps = {}) {
    await this.request('Modify', {
      body: {
        real_name: realName,
        nick,
        telephone
      }
    });

    return true;
  }

  get Password() {
    return {
      /**
       * 修改密码
       * @link http://www.dnspod.cn/docs/accounts.html#userpasswd-modify
       * @param {string} oldPassword
       * @param {string} newPassword
       * @returns {Promise<boolean>}
       */
      Modify: async ({oldPassword, newPassword}: Props.PasswordModifyProps) => {
        await this.request('Userpasswd', 'Modify', {
          body: {
            old_password: oldPassword,
            new_password: newPassword
          }
        });

        return true;
      }

    };
  }

  get Mail() {
    return {
      /**
       * 修改邮箱
       * @link http://www.dnspod.cn/docs/accounts.html#useremail-modify
       * @param {string} oldEmail
       * @param {string} newEmail
       * @param {string} password
       * @returns {Promise<boolean>}
       */
      Modify: async ({oldEmail, newEmail, password}: Props.EmailModifyProps) => {
        await this.request('Useremail', 'Modify', {
          body: {
            old_email: oldEmail,
            new_email: newEmail,
            password
          }
        });

        return true;
      }
    };
  }

  get Telephone() {
    return {
      /**
       * 获取手机验证码
       * @link http://www.dnspod.cn/docs/accounts.html#user-telephoneverify
       * @param {string} telephone
       * @returns {Promise<number>}
       */
      VarifyCode: async (telephone: string) => {
        const res = await this.request('Telephoneverify', 'Code', {
          body: {
            telephone
          }
        });

        return res.user;
      }
    };
  }

  /**
   * 获取用户日志
   * @link http://www.dnspod.cn/docs/accounts.html#user-log
   * @returns {Promise<any>}
   */
  public async Log() {
    const res = await this.request('Log');
    return res.log;
  }
}
