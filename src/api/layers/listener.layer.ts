import { EventEmitter } from 'events';
import { Page, Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { ExposedFn } from '../helpers/exposed.enum';
import {
  Ack,
  Chat,
  LiveLocation,
  Message,
  ParticipantEvent,
  PicTumb,
  ChatStatus
} from '../model';
import { SocketState, SocketStream } from '../model/enum';
import { InterfaceChangeMode } from '../model';
import { InterfaceMode } from '../model/enum/interface-mode';
import { InterfaceState } from '../model/enum/interface-state';
import { ProfileLayer } from './profile.layer';
import { callbackWile } from '../helpers';

declare global {
  interface Window {
    onMessage: any;
    onAnyMessage: any;
    onStateChange: any;
    onIncomingCall: any;
    onAck: any;
    onStreamChange: any;
    onFilePicThumb: any;
    onChatState: any;
    onUnreadMessage: any;
    onInterfaceChange: any;
    onAddedToGroup: any;
    func: any;
    onLiveLocation: any;
    waitNewMessages: any;
    onPoll: any;
  }
}

const callonMessage = new callbackWile();
const callOnack = new callbackWile();

export class ListenerLayer extends ProfileLayer {
  private listenerEmitter = new EventEmitter();

  constructor(
    public browser: Browser,
    public page: Page,
    session?: string,
    options?: CreateConfig
  ) {
    super(browser, page, session, options);

    this.page.on('close', () => {
      this.cancelAutoClose();
      this.spin('Page Closed', 'fail');
    });
  }

  public async initialize() {
    const functions = [...Object.values(ExposedFn)];

    for (const func of functions) {
      const has = await this.page
        .evaluate((func) => typeof window[func] === 'function', func)
        .catch(() => false);

      if (!has) {
        await this.page
          .exposeFunction(func, (...args: any) =>
            this.listenerEmitter.emit(func, ...args)
          )
          .catch(() => {});
      }
    }

    this.addMsg();
    await this.page
      .evaluate(() => {
        window.WAPI.onInterfaceChange((e: any) => {
          window.onInterfaceChange(e);
        });
        window.WAPI.onStreamChange((e: any) => {
          window.onStreamChange(e);
        });
        window.WAPI.onChatState((e: any) => {
          window.onChatState(e);
        });
        window.WAPI.onStateChange((e: any) => {
          window.onStateChange(e);
        });
        window.WAPI.onUnreadMessage((e: any) => {
          window.onUnreadMessage(e);
        });
        window.WAPI.waitNewMessages(false, (data: any) => {
          data.forEach((message: any) => {
            window.onMessage(message);
          });
        });
        window.WAPI.onAddedToGroup((e: any) => {
          window.onAddedToGroup(e);
        });
        window.WAPI.onAck((e: any) => {
          window.onAck(e);
        });
        window.WAPI.onPoll((e: any) => {
          window.onPoll(e);
        });
      })
      .catch(() => {});
  }

  public async addMsg() {
    this.page
      .evaluate(() => {
        let isHeroEqual = {};
        // try {
        window.Store.Msg.on('add', async (newMessage) => {
          if (!Object.is(isHeroEqual, newMessage)) {
            isHeroEqual = newMessage;
            if (newMessage && newMessage.isNewMsg) {
              const processMessageObj = await window.WAPI.processMessageObj(
                newMessage,
                true,
                false
              );
              window.onAnyMessage(processMessageObj);
            }
          }
        });
        // } catch { }
      })
      .catch(() => {});
  }

  public async onPoll(fn: (ack: any) => void) {
    this.listenerEmitter.on(ExposedFn.onPoll, (e) => {
      fn(e);
    });

    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onPoll, (e) => {
          fn(e);
        });
      }
    };
  }

  /**
   * @event Listens to all new messages
   * @param to callback
   * @fires Message
   */
  public async onAnyMessage(fn: (message: Message) => void) {
    this.listenerEmitter.on(ExposedFn.OnAnyMessage, (msg) => {
      fn(msg);
    });

    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.OnAnyMessage, (msg) => {
          fn(msg);
        });
      }
    };
  }

  /**
   * @event Listens to messages received
   * @returns Observable stream of messages
   */
  public async onStateChange(fn: (state: SocketState) => void) {
    this.listenerEmitter.on(ExposedFn.onStateChange, fn);

    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onStateChange, fn);
      }
    };
  }

  /**
   * @returns Returns chat state
   */
  public async onChatState(fn: (state: ChatStatus) => void) {
    this.listenerEmitter.on(ExposedFn.onChatState, (state: ChatStatus) => {
      fn(state);
    });
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onChatState, fn);
      }
    };
  }

  ////////////////////////////////////////////////////
  /**
   * @returns Returns the current state of the connection
   */
  public async onStreamChange(fn: (state: SocketStream) => void) {
    this.listenerEmitter.on(ExposedFn.onStreamChange, (state: SocketStream) => {
      fn(state);
    });
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onStreamChange, fn);
      }
    };
  }

  /**
   * @event Listens to interface mode change See {@link InterfaceState} and {@link InterfaceMode} for details
   * @returns A disposable object to cancel the event
   */
  public async onInterfaceChange(
    fn: (state: {
      displayInfo: InterfaceState;
      mode: InterfaceMode;
      info: InterfaceState;
    }) => void | InterfaceChangeMode | Promise<any>
  ) {
    this.listenerEmitter.on(ExposedFn.onInterfaceChange, fn);

    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onInterfaceChange, fn);
      }
    };
  }

  //////////////////////////////////////PRO
  /**
   * @returns Returns new UnreadMessage
   */
  public async onUnreadMessage(fn: (unread: Message) => void) {
    this.listenerEmitter.on(ExposedFn.onUnreadMessage, fn);
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onUnreadMessage, fn);
      }
    };
  }

  /**
   * @returns Returns new PicThumb
   */
  public async onFilePicThumb(fn: (pic: PicTumb) => void) {
    this.listenerEmitter.on(ExposedFn.onFilePicThumb, fn);
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onFilePicThumb, fn);
      }
    };
  }

  /**
   * @event Listens to messages received
   * @returns Observable stream of messages
   */
  public async onMessage(fn: (message: Message) => void) {
    this.listenerEmitter.on(ExposedFn.OnMessage, (state: Message) => {
      if (!callonMessage.checkObj(state.from, state.id)) {
        callonMessage.addObjects(state.from, state.id);
        fn(state);
      }
    });
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.OnMessage, (state: Message) => {
          if (!callonMessage.checkObj(state.from, state.id)) {
            callonMessage.addObjects(state.from, state.id);
            fn(state);
          }
        });
      }
    };
  }

  /**
   * @event Listens to messages acknowledgement Changes
   * @returns Observable stream of messages
   */
  public async onAck(fn: (ack: Ack) => void) {
    this.listenerEmitter.on(ExposedFn.onAck, (e: Ack) => {
      if (!callOnack.checkObj(e.ack, e.id._serialized)) {
        let key = callOnack.getObjKey(e.id._serialized);
        if (key) {
          callOnack.module[key].id = e.ack;
          fn(e);
        } else {
          callOnack.addObjects(e.ack, e.id._serialized);
          fn(e);
        }
      }
    });

    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onAck, (e: Ack) => {
          if (!callOnack.checkObj(e.ack, e.id._serialized)) {
            let key = callOnack.getObjKey(e.id._serialized);
            if (key) {
              callOnack.module[key].id = e.ack;
              fn(e);
            } else {
              callOnack.addObjects(e.ack, e.id._serialized);
              fn(e);
            }
          }
        });
      }
    };
  }

  /**
   * @event Listens to live locations from a chat that already has valid live locations
   * @param chatId the chat from which you want to subscribes to live location updates
   * @param fn callback that takes in a LiveLocation
   * @returns boolean, if returns false then there were no valid live locations in the chat of chatId
   * @emits <LiveLocation> LiveLocation
   */
  public async onLiveLocation(
    chatId: string,
    fn: (liveLocationChangedEvent: LiveLocation) => void
  ) {
    const method = 'onLiveLocation_' + chatId.replace('_', '').replace('_', '');
    return this.page
      .exposeFunction(method, (liveLocationChangedEvent: LiveLocation) =>
        fn(liveLocationChangedEvent)
      )
      .then((_) =>
        this.page.evaluate(
          ({ chatId, method }) => {
            //@ts-ignore
            return WAPI.onLiveLocation(chatId, window[method]);
          },
          { chatId, method }
        )
      );
  }

  /**
   * @event Listens to participants changed
   * @param to group id: xxxxx-yyyy@us.c
   * @param to callback
   * @returns Stream of ParticipantEvent
   */
  public async onParticipantsChanged(
    groupId: string,
    fn: (participantChangedEvent: ParticipantEvent) => void
  ) {
    const method =
      'onParticipantsChanged_' + groupId.replace('_', '').replace('_', '');
    return this.page
      .exposeFunction(method, (participantChangedEvent: ParticipantEvent) =>
        fn(participantChangedEvent)
      )
      .then((_) =>
        this.page.evaluate(
          ({ groupId, method }) => {
            //@ts-ignore
            WAPI.onParticipantsChanged(groupId, window[method]);
          },
          { groupId, method }
        )
      );
  }

  /**
   * @event Fires callback with Chat object every time the host phone is added to a group.
   * @param to callback
   * @returns Observable stream of Chats
   */
  public async onAddedToGroup(fn: (chat: Chat) => any) {
    this.listenerEmitter.on('onAddedToGroup', fn);

    return {
      dispose: () => {
        this.listenerEmitter.off('onAddedToGroup', fn);
      }
    };
  }

  /**
   * @event Listens to messages received
   * @returns Observable stream of messages
   */
  public async onIncomingCall(fn: (call: any) => any) {
    this.listenerEmitter.on('onIncomingCall', fn);

    return {
      dispose: () => {
        this.listenerEmitter.off('onIncomingCall', fn);
      }
    };
  }
}
