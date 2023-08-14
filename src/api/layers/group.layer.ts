import { Page, Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { RetrieverLayer } from './retriever.layer';
import { checkValuesSender } from '../helpers/layers-interface';
import {
  base64MimeType,
  fileToBase64,
  downloadFileToBase64,
  resizeImg
} from '../helpers';
import { GroupSettings } from '../model/enum';

export class GroupLayer extends RetrieverLayer {
  constructor(
    public browser: Browser,
    public page: Page,
    session?: string,
    options?: CreateConfig
  ) {
    super(browser, page, session, options);
  }

  /**
   * Parameters to change group settings, see {@link GroupSettings for details}
   * @param {string} groupId group number
   * @param {GroupSettings} settings
   * @param {boolean} value
   */
  public async setGroupSettings(
    groupId: string,
    settings: GroupSettings,
    value: boolean
  ): Promise<Object> {
    return new Promise(async (resolve, reject) => {
      const typeFunction = 'setGroupSettings';
      const type = 'string';
      const check = [
        {
          param: 'groupId',
          type: type,
          value: groupId,
          function: typeFunction,
          isUser: true
        },
        {
          param: 'settings',
          type: type,
          value: settings,
          function: typeFunction,
          isUser: true
        },
        {
          param: 'value',
          type: type,
          value: value,
          function: typeFunction,
          isUser: true
        }
      ];

      const validating = checkValuesSender(check);
      if (typeof validating === 'object') {
        return reject(validating);
      }

      const result = await this.page.evaluate(
        ({ groupId, settings, value }) => {
          return WAPI.setGroupSettings(groupId, settings, value);
        },
        { groupId, settings, value }
      );

      if (result['erro'] == true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  }

  /**
   * Parameters to change group image
   * @param {string} groupId group number
   * @param {string} path of image
   */
  public async setGroupImage(groupId: string, path: string) {
    let b64 = await downloadFileToBase64(path, [
      'image/gif',
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/webp'
    ]);
    if (!b64) {
      b64 = await fileToBase64(path);
    }
    if (b64) {
      const buff = Buffer.from(
        b64.replace(/^data:image\/(png|jpe?g|webp);base64,/, ''),
        'base64'
      );
      const mimeInfo = base64MimeType(b64);

      if (!mimeInfo || mimeInfo.includes('image')) {
        let _webb64_96 = await resizeImg(buff, { width: 96, height: 96 }),
          _webb64_640 = await resizeImg(buff, { width: 640, height: 640 });
        let obj = { a: _webb64_640, b: _webb64_96 };

        return await this.page.evaluate(
          ({ obj, groupId }) => WAPI.setProfilePic(obj, groupId),
          {
            obj,
            groupId
          }
        );
      } else {
        console.log('Not an image, allowed formats png, jpeg and webp');
        return false;
      }
    }
  }

  /**
   * Parameters to change group title
   * @param {string} groupId group number
   * @param {string} title group title
   */
  public async setGroupTitle(groupId: string, title: string): Promise<Object> {
    return new Promise(async (resolve, reject) => {
      const typeFunction = 'setGroupTitle';
      const type = 'string';
      const check = [
        {
          param: 'groupId',
          type: type,
          value: groupId,
          function: typeFunction,
          isUser: true
        },
        {
          param: 'title',
          type: type,
          value: title,
          function: typeFunction,
          isUser: true
        }
      ];

      const validating = checkValuesSender(check);
      if (typeof validating === 'object') {
        return reject(validating);
      }

      const result = await this.page.evaluate(
        ({ groupId, title }) => {
          return WAPI.setGroupTitle(groupId, title);
        },
        { groupId, title }
      );

      if (result['erro'] == true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  }

  /**
   * Parameters to change group description
   * @param {string} groupId group number
   * @param {string} description group description
   */
  public async setGroupDescription(
    groupId: string,
    description: string
  ): Promise<Object> {
    return new Promise(async (resolve, reject) => {
      const typeFunction = 'setGroupDescription';
      const type = 'string';
      const check = [
        {
          param: 'groupId',
          type: type,
          value: groupId,
          function: typeFunction,
          isUser: true
        },
        {
          param: 'description',
          type: type,
          value: description,
          function: typeFunction,
          isUser: true
        }
      ];

      const validating = checkValuesSender(check);
      if (typeof validating === 'object') {
        return reject(validating);
      }

      const result = await this.page.evaluate(
        ({ groupId, description }) => {
          return WAPI.setGroupDescription(groupId, description);
        },
        { groupId, description }
      );

      if (result['erro'] == true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  }

  /**
   * Retrieve all groups
   * @returns array of groups
   */
  public async getAllChatsGroups() {
    return await this.page.evaluate(async () => {
      let chats = WAPI.getAllChats();
      return (await chats).filter((chat) => chat.kind === 'group');
    });
  }

  /**
   * Retrieve all groups new messages
   * @returns array of groups
   */
  public async getChatGroupNewMsg() {
    return await this.page.evaluate(() => {
      let chats = WAPI.getAllChatsWithNewMsg();
      return chats.filter((chat) => chat.kind === 'group');
    });
  }

  /**
   * Removes the host device from the group
   * @param groupId group id
   */
  public async leaveGroup(groupId: string) {
    return this.page.evaluate((groupId) => WAPI.leaveGroup(groupId), groupId);
  }

  /**
   * Retrieves group members as [Id] objects
   * @param groupId group id
   */
  public async getGroupMembers(groupId: string, time: string): Promise<Object> {
    return new Promise(async (resolve, reject) => {
      const typeFunction = 'getGroupMembers';
      const type = 'string';
      const check = [
        {
          param: 'groupId',
          type: type,
          value: groupId,
          function: typeFunction,
          isUser: true
        }
      ];
      const validating = checkValuesSender(check);
      if (typeof validating === 'object') {
        return reject(validating);
      }
      const result = this.page.evaluate(
        (groupId: string, time: string) =>
          WAPI.getGroupParticipant(groupId, time),
        groupId,
        time
      );
      if (result['erro'] == true) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  }

  // /**
  //  * Returns group members [Contact] objects
  //  * @param groupId
  //  */
  // public async getGroupMembers(groupId: string) {
  //   const membersIds = await this.getGroupMembersIds(groupId);
  //   const actions = membersIds.map((memberId) => {
  //     return this.getContact(memberId._serialized);
  //   });
  //   return Promise.all(actions);
  // }

  /**
   * Reset group invitation link
   * @param chatId
   * @returns boolean
   */
  public async revokeGroupInviteLink(chatId: string) {
    return await this.page.evaluate(
      (chatId) => WAPI.revokeGroupInviteLink(chatId),
      chatId
    );
  }

  /**
   * Generates group-invite link
   * @param chatId
   * @returns Invitation link
   */
  public async getGroupInviteLink(chatId: string) {
    return await this.page.evaluate(
      (chatId) => WAPI.getGroupInviteLink(chatId),
      chatId
    );
  }
  /**
   * Generates group-invite link
   * @param inviteCode
   * @returns Invite code from group link. Example: CMJYfPFqRyE2GxrnkldYED
   */
  public async getGroupInfoFromInviteLink(inviteCode: string) {
    inviteCode = inviteCode.replace('chat.whatsapp.com/', '');
    inviteCode = inviteCode.replace('invite/', '');
    inviteCode = inviteCode.replace('https://', '');
    inviteCode = inviteCode.replace('http://', '');
    return await this.page.evaluate(
      (inviteCode) => WAPI.getGroupInfoFromInviteLink(inviteCode),
      inviteCode
    );
  }

  /**
   * Creates a new chat group
   * @param groupName Group name
   * @param contacts Contacts that should be added.
   */
  public async createGroup(groupName: string, contacts: string | string[]) {
    return await this.page.evaluate(
      ({ groupName, contacts }) => WAPI.createGroup(groupName, contacts),
      { groupName, contacts }
    );
  }

  /**
   * Removes participant from group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async removeParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.removeParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Adds participant to Group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async addParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.addParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Promotes participant as Admin in given group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async promoteParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.promoteParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Demotes admin privileges of participant
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async demoteParticipant(
    groupId: string,
    participantId: string | string[]
  ) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.demoteParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Retrieves group admins
   * @param groupId Group/Chat id ('0000000000-00000000@g.us')
   */
  public async getGroupAdmins(groupId: string): Promise<Object> {
    return new Promise(async (resolve, reject) => {
      const typeFunction = 'getGroupAdmins';
      const type = 'string';
      const check = [
        {
          param: 'groupId',
          type: type,
          value: groupId,
          function: typeFunction,
          isUser: true
        }
      ];
      const validating = checkValuesSender(check);
      if (typeof validating === 'object') {
        return reject(validating);
      }
      const result = this.page.evaluate(
        (groupId: string) => WAPI.getGroupAdmins(groupId),
        groupId
      );
      if (result['erro'] == true) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  }
  /**
   * Join a group with invite code
   * @param inviteCode
   */
  public async joinGroup(inviteCode: string) {
    inviteCode = inviteCode.replace('chat.whatsapp.com/', '');
    inviteCode = inviteCode.replace('invite/', '');
    inviteCode = inviteCode.replace('https://', '');
    inviteCode = inviteCode.replace('http://', '');
    return await this.page.evaluate(
      (inviteCode) => WAPI.joinGroup(inviteCode),
      inviteCode
    );
  }
}
