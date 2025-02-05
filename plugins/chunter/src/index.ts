//
// Copyright © 2020, 2021 Anticrm Platform Contributors.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

import { ActivityMessage, ActivityMessageViewlet } from '@hcengineering/activity'
import type { Person } from '@hcengineering/contact'
import type {
  Account,
  AttachedDoc,
  Class,
  Doc,
  Mixin,
  Ref,
  RelatedDocument,
  Space,
  Timestamp
} from '@hcengineering/core'
import { NotificationType } from '@hcengineering/notification'
import type { Asset, Plugin, Resource } from '@hcengineering/platform'
import { IntlString, plugin } from '@hcengineering/platform'
import type { Preference } from '@hcengineering/preference'
import { AnyComponent, Location, ResolvedLocation } from '@hcengineering/ui'
import { Action } from '@hcengineering/view'

/**
 * @public
 */
export interface ChunterSpace extends Space {
  lastMessage?: Timestamp
  pinned?: Ref<ChunterMessage>[]
}

/**
 * @public
 */
export interface Channel extends ChunterSpace {
  topic?: string
}

/**
 * @public
 */
export interface DirectMessage extends ChunterSpace {}

/**
 * @public
 */
export interface ChunterMessage extends AttachedDoc {
  content: string
  attachments?: number
  createBy: Ref<Account>
  editedOn?: Timestamp
  reactions?: number
}

/**
 * @public
 */
export interface ChunterMessageExtension extends ChunterMessage {}

/**
 * @public
 */
export interface ThreadMessage extends ChunterMessage {
  attachedTo: Ref<Message>
  attachedToClass: Ref<Class<Message>>
}

/**
 * @public
 */
export interface Message extends ChunterMessage {
  attachedTo: Ref<Space>
  attachedToClass: Ref<Class<Space>>
  replies?: Ref<Person>[]
  repliesCount?: number
  lastReply?: Timestamp
}

/**
 * @public
 * @deprecated use ChatMessage instead
 */
export interface Comment extends AttachedDoc {
  message: string
  attachments?: number
  reactions?: number
  pinned?: boolean
}

/**
 * @public
 */
export interface Backlink extends Comment {
  // A target document
  // attachedTo <- target document we point to
  // A target document class
  // attachedToClass

  // Source document we have reference from, it should be parent document for Comment/Message.
  backlinkId: Ref<Doc>
  // Source document class
  backlinkClass: Ref<Class<Doc>>
  // Reference to comment documentId
  attachedDocId?: Ref<Doc>
}

/**
 * @public
 */
export interface SavedMessages extends Preference {
  attachedTo: Ref<ChunterMessage>
}

/**
 * @public
 */
export interface DirectMessageInput extends Class<Doc> {
  component: AnyComponent
}

/**
 * @public
 */
export interface ChatMessage extends ActivityMessage {
  message: string
  attachments?: number
  isEdited?: boolean
}

/**
 * @public
 */
export interface ChatMessageViewlet extends ActivityMessageViewlet {
  label?: IntlString
}

/**
 * @public
 */
export const chunterId = 'chunter' as Plugin

export * from './utils'

export default plugin(chunterId, {
  icon: {
    Chunter: '' as Asset,
    Hashtag: '' as Asset,
    Thread: '' as Asset,
    Lock: '' as Asset,
    Bookmark: '' as Asset,
    ChannelBrowser: '' as Asset
  },
  component: {
    DmHeader: '' as AnyComponent,
    ChannelView: '' as AnyComponent,
    ThreadView: '' as AnyComponent,
    Thread: '' as AnyComponent,
    Reactions: '' as AnyComponent,
    ChatMessageInput: '' as AnyComponent,
    ChatMessagesPresenter: '' as AnyComponent,
    ChatMessagePresenter: '' as AnyComponent
  },
  class: {
    Message: '' as Ref<Class<Message>>,
    ChunterMessage: '' as Ref<Class<ChunterMessage>>,
    ThreadMessage: '' as Ref<Class<ThreadMessage>>,
    Backlink: '' as Ref<Class<Backlink>>,
    Comment: '' as Ref<Class<Comment>>,
    ChunterSpace: '' as Ref<Class<ChunterSpace>>,
    Channel: '' as Ref<Class<Channel>>,
    SavedMessages: '' as Ref<Class<SavedMessages>>,
    DirectMessage: '' as Ref<Class<DirectMessage>>,
    ChatMessage: '' as Ref<Class<ChatMessage>>,
    ChatMessageViewlet: '' as Ref<Class<ChatMessageViewlet>>
  },
  mixin: {
    DirectMessageInput: '' as Ref<Mixin<DirectMessageInput>>,
    ChunterMessageExtension: '' as Ref<Mixin<ChunterMessageExtension>>
  },
  space: {
    Backlinks: '' as Ref<Space>
  },
  string: {
    Reactions: '' as IntlString,
    EditUpdate: '' as IntlString,
    EditCancel: '' as IntlString,
    Comments: '' as IntlString,
    Settings: '' as IntlString,
    ArchiveChannel: '' as IntlString,
    UnarchiveChannel: '' as IntlString,
    ArchiveConfirm: '' as IntlString,
    Message: '' as IntlString,
    MessageOn: '' as IntlString,
    UnarchiveConfirm: '' as IntlString,
    ConvertToPrivate: '' as IntlString,
    DirectNotificationTitle: '' as IntlString,
    DirectNotificationBody: '' as IntlString,
    AddCommentPlaceholder: '' as IntlString,
    LeftComment: '' as IntlString
  },
  resolver: {
    Location: '' as Resource<(loc: Location) => Promise<ResolvedLocation | undefined>>
  },
  ids: {
    DMNotification: '' as Ref<NotificationType>,
    MentionNotification: '' as Ref<NotificationType>,
    ThreadNotification: '' as Ref<NotificationType>,
    ChannelNotification: '' as Ref<NotificationType>
  },
  app: {
    Chunter: '' as Ref<Doc>
  },
  backreference: {
    // Update list of back references
    Update: '' as Resource<(source: Doc, key: string, target: RelatedDocument[], label: IntlString) => Promise<void>>
  },
  action: {
    DeleteChatMessage: '' as Ref<Action>
  }
})
