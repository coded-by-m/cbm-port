/**
 * Injeta um bloco JSON-LD no HTML do servidor.
 *
 * O `<` é escapado: um texto de case com `</script>` fecharia a tag antes da
 * hora. Server component — o JSON sai no HTML estático, sem custo de JS.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
