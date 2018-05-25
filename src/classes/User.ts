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

  public async Detail() {
    const res = await this.request('Detail');
    return res.info.user;
  }

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

  public async Log() {
    const res = await this.request('Log');
    return res.log;
  }
}