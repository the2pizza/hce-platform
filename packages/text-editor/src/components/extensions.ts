import TableHeader from '@tiptap/extension-table-header'

import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'

import { type Level } from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

import Gapcursor from '@tiptap/extension-gapcursor'
import ListKeymap from '@tiptap/extension-list-keymap'

import { type AnyExtension } from '@tiptap/core'
import Link from '@tiptap/extension-link'
import Typography from '@tiptap/extension-typography'
import { type CompletionOptions } from '../Completion'
import MentionList from './MentionList.svelte'
import { NodeUuidExtension } from './extension/nodeUuid'
import { SvelteRenderer } from './node-view'
import { CodemarkExtension } from './extension/codemark'
import type { SuggestionKeyDownProps, SuggestionProps } from './extension/suggestion'

import { Table, TableCell, TableRow } from './extension/table'

export const tableExtensions = [
  Table.configure({
    resizable: false,
    HTMLAttributes: {
      class: 'proseTable'
    }
  }),
  TableRow.configure({}),
  TableHeader.configure({}),
  TableCell.configure({})
]

export const taskListExtensions = [
  TaskList,
  TaskItem.configure({
    nested: true,
    HTMLAttributes: {
      class: 'flex flex-grow gap-1 checkbox_style'
    }
  })
]

export const supportedHeadingLevels: Level[] = [1, 2, 3]

export const defaultExtensions: AnyExtension[] = [
  StarterKit.configure({
    code: {
      HTMLAttributes: {
        class: 'proseCode'
      }
    },
    codeBlock: {
      languageClassPrefix: 'language-',
      exitOnArrowDown: true,
      exitOnTripleEnter: true,
      HTMLAttributes: {
        class: 'proseCodeBlock'
      }
    },
    heading: {
      levels: supportedHeadingLevels,
      HTMLAttributes: {
        class: 'proseHeading'
      }
    }
  }),
  CodemarkExtension,
  Highlight.configure({
    multicolor: false
  }),
  Underline.configure({}),
  Typography.configure({}),
  Gapcursor,
  Link.configure({
    openOnClick: true,
    HTMLAttributes: { class: 'cursor-pointer', rel: 'noopener noreferrer', target: '_blank' }
  }),
  ListKeymap.configure({}),
  NodeUuidExtension,
  ...tableExtensions
  // ...taskListExtensions // Disable since tasks are not working properly now.
]

export const mInsertTable = [
  {
    label: '2x2',
    rows: 2,
    cols: 2,
    header: false
  },
  {
    label: '3x3',
    rows: 3,
    cols: 3,
    header: false
  },
  {
    label: '2x1',
    rows: 2,
    cols: 1,
    header: false
  },
  {
    label: '5x5',
    rows: 5,
    cols: 5,
    header: false
  },
  {
    label: '1x2',
    rows: 1,
    cols: 2,
    header: false
  },
  {
    label: 'Headed 2x2',
    rows: 2,
    cols: 2,
    header: true
  },
  {
    label: 'Headed 3x3',
    rows: 3,
    cols: 3,
    header: true
  },
  {
    label: 'Headed 2x1',
    rows: 2,
    cols: 1,
    header: true
  },
  {
    label: 'Headed 5x5',
    rows: 5,
    cols: 5,
    header: true
  },
  {
    label: 'Headed 1x2',
    rows: 1,
    cols: 2,
    header: true
  }
]

/**
 * @public
 */
export const completionConfig: Partial<CompletionOptions> = {
  HTMLAttributes: {
    class: 'reference'
  },
  suggestion: {
    items: async () => {
      return []
    },
    render: () => {
      let component: any

      return {
        onStart: (props: SuggestionProps) => {
          component = new SvelteRenderer(MentionList, {
            element: document.body,
            props: {
              ...props,
              close: () => {
                component.destroy()
              }
            }
          })
        },
        onUpdate (props: SuggestionProps) {
          component.updateProps(props)
        },
        onKeyDown (props: SuggestionKeyDownProps) {
          if (props.event.key === 'Escape') {
            props.event.stopPropagation()
          }
          return component.onKeyDown(props)
        },
        onExit () {
          component.destroy()
        }
      }
    }
  }
}
