<!--
// Copyright © 2020 Anticrm Platform Contributors.
// Copyright © 2023 Hardcore Engineering Inc.
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
-->
<script lang="ts">
  import type { Doc, Ref } from '@hcengineering/core'
  import type { Asset, IntlString } from '@hcengineering/platform'
  import type { Action, AnySvelteComponent } from '@hcengineering/ui'
  import {
    ActionIcon,
    Icon,
    IconChevronDown,
    IconMoreH,
    Label,
    Menu,
    showPopup,
    getTreeCollapsed,
    setTreeCollapsed
  } from '@hcengineering/ui'
  import { createEventDispatcher } from 'svelte'

  export let _id: Ref<Doc> | string | undefined = undefined
  export let icon: Asset | AnySvelteComponent | undefined = undefined
  export let iconProps: Record<string, any> | undefined = undefined
  export let label: IntlString | undefined = undefined
  export let title: string | undefined = undefined
  export let notifications = 0
  export let parent: boolean = false
  export let node: boolean = false
  export let indent: boolean = false
  export let folder: boolean = false
  export let level: number = 0
  export let collapsed: boolean = getTreeCollapsed(_id)
  export let selected: boolean = false
  export let bold: boolean = false
  export let actions: (originalEvent?: MouseEvent) => Promise<Action[]> = async () => []

  let hovered = false
  async function onMenuClick (ev: MouseEvent) {
    showPopup(Menu, { actions: await actions(ev), ctx: _id }, ev.target as HTMLElement, () => {
      hovered = false
    })
    hovered = true
  }

  const dispatch = createEventDispatcher()
  $: if (_id) collapsed = getTreeCollapsed(_id)
  $: setTreeCollapsed(_id, collapsed)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="antiNav-element"
  class:selected
  class:hovered
  class:parent
  class:collapsed
  style:padding-left={`${level > 0 ? level * 1.25 + 0.125 : indent ? 2.5 : 0.75}rem`}
  on:click={() => {
    collapsed = !collapsed
    dispatch('click')
  }}
>
  {#if icon && !node}
    <div class="an-element__icon" class:folder>
      <Icon {icon} {iconProps} size={'small'} />
    </div>
  {/if}
  <span class="an-element__label" class:title={node} class:bold>
    {#if label}<Label {label} />{:else}{title}{/if}
  </span>

  {#if parent}
    <div class="an-element__tool arrow hidden">
      <IconChevronDown size={'small'} />
    </div>
  {/if}

  <div class="an-element__grow" />

  {#if !parent}
    <div class="an-element__tool" class:pressed={hovered} on:click|preventDefault|stopPropagation={onMenuClick}>
      <IconMoreH size={'small'} />
    </div>
  {:else}
    {#await actions() then actionItems}
      {#if actionItems.length === 1 && actionItems[0].icon}
        <div id={_id} class="an-element__tool">
          <ActionIcon
            label={actionItems[0].label}
            icon={actionItems[0].icon}
            size={'small'}
            action={async (ev) => {
              actionItems[0].action(_id, ev)
            }}
          />
        </div>
      {:else if actionItems.length > 1}
        <div class="an-element__tool" class:pressed={hovered} on:click|preventDefault|stopPropagation={onMenuClick}>
          <IconMoreH size={'small'} />
        </div>
      {/if}
    {/await}
  {/if}
  {#if notifications > 0 && collapsed}
    <div class="an-element__counter">{notifications}</div>
  {/if}
</div>
{#if parent && !collapsed}
  <div class="antiNav-element__dropbox"><slot /></div>
{/if}
