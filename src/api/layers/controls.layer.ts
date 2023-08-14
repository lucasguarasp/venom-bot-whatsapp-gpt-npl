import { Page, Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { UILayer } from './ui.layer';
import { checkValuesSender } from '../helpers/layers-interface';

export class ControlsLayer extends UILayer {
  constructor(
    public browser: Browser,
    public page: Page,
    session?: string,
    options?: CreateConfig
  ) {
    super(browser, page, session, options);
  }

  /**
   * Unblock contact
   * @param contactId {string} id '000000000000@c.us'
   * @returns boolean
   */
  public async unblockContact(contactId: string) {
    return this.page.evaluate(
      (contactId: string) => WAPI.unblockContact(contactId),
      contactId
    );
  }

  /**
   * Block contact
   * @param contactId {string} id '000000000000@c.us'
   * @returns boolean
   */
  public async blockContact(contactId: string) {
    return this.page.evaluate(
      (contactId: string) => WAPI.blockContact(contactId),
      contactId
    );
  }

  /**
   * Mark unread chat
   * @param contactId {string} id '000000000000@c.us'
   * @returns bollean
   */
  public async markUnseenMessage(contactId: string) {
    return new Promise(async (resolve, reject) => {
      const typeFunction = 'markUnseenMessage';
      const type = 'string';
      const check = [
        {
          param: 'contactId',
          type: type,
          value: contactId,
          function: typeFunction,
          isUser: true
        }
      ];

      const validating = checkValuesSender(check);
      if (typeof validating === 'object') {
        return reject(validating);
      }
      const result = await this.page.evaluate(
        (contactId: string) => WAPI.markUnseenMessage(contactId),
        contactId
      );

      if (result['erro'] == true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  }

  /**
   * Mark chat as read ✔️✔️
   * @param contactId {string} id '000000000000@c.us'
   * @returns boolean
   */
  public async markMarkSeenMessage(contactId: string) {
    return new Promise(async (resolve, reject) => {
      const typeFunction = 'markMarkSeenMessage';
      const type = 'string';
      const check = [
        {
          param: 'contactId',
          type: type,
          value: contactId,
          function: typeFunction,
          isUser: true
        }
      ];

      const validating = checkValuesSender(check);
      if (typeof validating === 'object') {
        return reject(validating);
      }
      const result = await this.page.evaluate(
        (contactId: string) => WAPI.markMarkSeenMessage(contactId),
        contactId
      );

      if (result['erro'] == true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  }

  /**
   * Deletes the given chat
   * @param chatId {string} id '000000000000@c.us'
   * @returns boolean
   */
  public async deleteChat(chatId: string) {
    return await this.page.evaluate(
      (chatId) => WAPI.deleteConversation(chatId),
      chatId
    );
  }

  /**
   * Archive and unarchive chat messages with true or false
   * @param chatId {string} id '000000000000@c.us'
   * @param option {boolean} true or false
   * @returns boolean
   */
  public async archiveChat(chatId: string, option: boolean) {
    return this.page.evaluate(
      ({ chatId, option }) => WAPI.archiveChat(chatId, option),
      { chatId, option }
    );
  }

  /**
   * Pin and Unpin chat messages with true or false
   * @param chatId {string} id '000000000000@c.us'
   * @param option {boolean} true or false
   * @param nonExistent {boolean} Pin chat, non-existent (optional)
   * @returns object
   */
  public async pinChat(chatId: string, option: boolean, nonExistent?: boolean) {
    return new Promise(async (resolve, reject) => {
      const result = await this.page.evaluate(
        ({ chatId, option, nonExistent }) => {
          return WAPI.pinChat(chatId, option, nonExistent);
        },
        { chatId, option, nonExistent }
      );
      if (result['erro'] == true) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  }

  /**
   * Deletes all messages of given chat
   * @param chatId
   * @returns boolean
   */
  public async clearChatMessages(chatId: string) {
    return this.page.evaluate(
      (chatId) => WAPI.clearChatMessages(chatId),
      chatId
    );
  }

  /**
   * Deletes message of given message id
   * @param chatId The chat id from which to delete the message.
   * @param messageId The specific message id of the message to be deleted
   * @param onlyLocal If it should only delete locally (message remains on the other recipienct's phone). Defaults to false.
   */
  public async deleteMessage(
    chatId: string,
    messageId: string[]
  ): Promise<Object> {
    return new Promise(async (resolve, reject) => {
      const typeFunction = 'deleteMessage';
      const type = 'string';
      const check = [
        {
          param: 'chatId',
          type: type,
          value: chatId,
          function: typeFunction,
          isUser: true
        },
        {
          param: 'messageId',
          type: 'object',
          value: messageId,
          function: typeFunction,
          isUser: true
        }
      ];

      const validating = checkValuesSender(check);
      if (typeof validating === 'object') {
        return reject(validating);
      }
      const result = await this.page.evaluate(
        ({ chatId, messageId }) => WAPI.deleteMessages(chatId, messageId),
        { chatId, messageId }
      );

      if (result['erro'] === true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  }

  /**
   * Archive and unarchive chat messages with true or false
   * @param chatId {string} id '000000000000@c.us'
   * @param option {boolean} true or false
   * @returns boolean
   */
  public async setMessagesAdminsOnly(chatId: string, option: boolean) {
    return this.page.evaluate(
      ({ chatId, option }) => WAPI.setMessagesAdminsOnly(chatId, option),
      { chatId, option }
    );
  }

  public async reload() {
    await this.page.evaluate(() => {
      window.location.reload();
    });
  }
}
