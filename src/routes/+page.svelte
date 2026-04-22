<script lang="ts">
  import FeatureCard from '$lib/components/FeatureCard.svelte'
  import {
    Badge,
    Button,
    CheckboxField,
    Dropdown,
    Form,
    FormField,
    InputField,
    Label,
    RadioGroup,
    SearchField,
    SelectField,
    TextareaField,
    ToastViewport,
    Tooltip,
    toastStore,
    type DropdownItem,
    type SelectOption
  } from '$lib'

  const features = [
    {
      tag: 'Design System',
      title: 'Skeleton UI + Tailwind v4',
      copy: 'Adaptive components, a CSS token theme, and dark mode — all wired up and ready to extend.'
    },
    {
      tag: 'DX',
      title: 'Strict TypeScript by default',
      copy: 'Svelte runes + strict TS make component contracts explicit and easy to scale as the app grows.'
    },
    {
      tag: 'Workflow',
      title: 'Lint + format wired in',
      copy: 'Prettier and ESLint are preconfigured so the team can enforce consistency from the first commit.'
    }
  ]

  const milestones = [
    'Connect a real data source',
    'Add auth flow and route protection',
    'Create feature modules under src/lib'
  ]

  let featureQuery = $state('')
  const filteredFeatures = $derived.by(() => {
    const query = featureQuery.trim().toLowerCase()
    if (!query) return features

    return features.filter((feature) => {
      const haystack = `${feature.tag} ${feature.title} ${feature.copy}`.toLowerCase()
      return haystack.includes(query)
    })
  })

  const contactMethods: SelectOption[] = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'slack', label: 'Slack' }
  ]

  const roleOptions: SelectOption[] = [
    { value: 'founder', label: 'Founder' },
    { value: 'operator', label: 'Operator' },
    { value: 'engineer', label: 'Engineer' }
  ]

  const cadenceOptions: DropdownItem[] = [
    { value: 'daily', label: 'Daily updates' },
    { value: 'weekly', label: 'Weekly updates' },
    { value: 'monthly', label: 'Monthly updates' }
  ]

  let submitted = $state<Record<string, string>>({})
  let pickedCadence = $state('Weekly updates')

  async function handleFormData (payload: { formData: FormData }) {
    const entries = Object.fromEntries(payload.formData.entries())
    submitted = Object.fromEntries(
      Object.entries(entries).map(([key, value]) => [key, String(value)])
    )

    const requestBody = {
      fullName: submitted.fullName,
      email: submitted.email,
      phone: submitted.phone,
      role: submitted.role,
      contactMethod: submitted.contactMethod,
      notes: submitted.notes,
      priority: submitted.priority,
      agreeToTerms: submitted.agreeToTerms === 'yes'
    }

    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const result = (await response.json().catch(() => null)) as {
      ok?: boolean
      id?: string
      errors?: string[]
    } | null

    if (!response.ok || !result?.ok) {
      const message = result?.errors?.[0] ?? 'Unable to save your submission right now.'
      toastStore.addToast({
        title: 'Save failed',
        description: message,
        tone: 'danger'
      })
      return
    }

    toastStore.addToast({
      title: 'Submission saved',
      description: `Saved ${Object.keys(submitted).length} fields to Firestore with id ${result.id}.`,
      tone: 'success'
    })
  }

  function handleDropdownSelect (item: DropdownItem) {
    pickedCadence = item.label
    toastStore.addToast({
      title: 'Dropdown updated',
      description: `Notification cadence: ${item.label}`,
      tone: 'primary'
    })
  }

  function handleFeatureSearch (query: string) {
    featureQuery = query
  }
</script>

<section class="hero" data-animate>
  <p class="eyebrow">liaizon.ai</p>
  <h1>Build faster with a strong shell and intentional defaults.</h1>
  <p>
    Monochrome-first design system, dark mode toggle, Skeleton UI components, and a clean TypeScript
    toolchain — ready for rapid product development.
  </p>
  <div class="hero-actions">
    <a class="btn-solid btn" href="#features">Explore Starter</a>
    <a class="btn-quiet btn" href="https://skeleton.dev">Skeleton UI</a>
  </div>
</section>

<section id="features" class="section-block">
  <div class="section-title-row">
    <h2>Starter building blocks</h2>
    <p>Designed to be replaced iteratively, not rewritten.</p>
  </div>

  <SearchField
    name="feature-search"
    label="Search starter features"
    placeholder="Search features"
    submitLabel="Find"
    clearLabel="Reset"
    searchOnInput={true}
    debounceMs={200}
    minQueryLength={2}
    value={featureQuery}
    onsearch={handleFeatureSearch}
  />

  <div class="feature-grid">
    {#each filteredFeatures as feature (feature.title)}
      <FeatureCard {...feature} />
    {/each}
  </div>

  {#if filteredFeatures.length === 0}
    <p class="ui-hint">No features match that query yet.</p>
  {/if}
</section>

<section id="roadmap" class="section-block roadmap" data-animate>
  <div class="section-title-row">
    <h2>Suggested next moves</h2>
    <p>A pragmatic sequence to turn the starter into a product.</p>
  </div>

  <ol>
    {#each milestones as item (item)}
      <li>{item}</li>
    {/each}
  </ol>
</section>

<section id="ui-kit" class="section-block ui-kit" data-animate>
  <div class="section-title-row">
    <h2>Reusable UI Components</h2>
    <p>Initial form and feedback primitives with TypeScript contracts and accessible defaults.</p>
  </div>

  <div class="ui-demo-row">
    <Badge tone="primary">New Kit</Badge>
    <Badge tone="success">Stable API</Badge>
    <Badge tone="warning">Draft Theme</Badge>
  </div>

  <Form class="ui-demo-form" onsubmitdata={handleFormData}>
    <FormField label="Full name" forId="demo-name" required>
      <InputField id="demo-name" name="fullName" kind="text" placeholder="Ava Thompson" required />
    </FormField>

    <FormField label="Email" forId="demo-email" required hint="Used for launch updates only.">
      <InputField
        id="demo-email"
        name="email"
        kind="email"
        placeholder="you@company.com"
        required
      />
    </FormField>

    <FormField label="Phone" forId="demo-phone">
      <InputField id="demo-phone" name="phone" kind="phone" placeholder="+1 555 010 1234" />
    </FormField>

    <FormField label="Role" forId="demo-role" required>
      <SelectField id="demo-role" name="role" options={roleOptions} required />
    </FormField>

    <FormField label="Preferred Contact Method" forId="demo-contact" required>
      <SelectField id="demo-contact" name="contactMethod" options={contactMethods} required />
    </FormField>

    <FormField label="Project Notes" forId="demo-notes">
      <TextareaField
        id="demo-notes"
        name="notes"
        placeholder="What are you building next?"
        rows={5}
      />
    </FormField>

    <RadioGroup
      name="priority"
      legend="Support Priority"
      options={[
        { value: 'standard', label: 'Standard' },
        { value: 'priority', label: 'Priority' }
      ]}
    />

    <CheckboxField name="agreeToTerms" value="yes" required>
      I agree to the pilot terms and privacy notice.
    </CheckboxField>

    <div class="ui-demo-actions">
      <Button type="submit" variant="solid">Submit FormData</Button>
      <Tooltip text="Shows how standalone label can be reused outside field wrappers.">
        <button type="button" class="ui-inline-help">Need help?</button>
      </Tooltip>
    </div>
  </Form>

  <div class="ui-demo-row">
    <Label forId="demo-cadence">Notification cadence</Label>
    <Dropdown
      id="demo-cadence"
      label={pickedCadence}
      items={cadenceOptions}
      onselect={handleDropdownSelect}
    />
  </div>

  {#if Object.keys(submitted).length > 0}
    <pre class="ui-result-panel">{JSON.stringify(submitted, null, 2)}</pre>
  {/if}
</section>

<ToastViewport />
