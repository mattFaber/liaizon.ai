<script lang="ts">
  interface Props {
    tag: string
    title: string
    copy: string
  }

  const { tag, title, copy }: Props = $props()
</script>

<article class="feature-card" data-animate>
  <p class="card-tag">{tag}</p>
  <h3>{title}</h3>
  <p>{copy}</p>
</article>
