async function applyHighlighter() {
  const source = await readJson(WITH_RAMBDAX ? DESTINATIONS.rambdaxDataSource: DESTINATIONS.dataSource)

  const ApplyHighlighterInstance = new ApplyHighlighter()
  await ApplyHighlighterInstance.init()
  const {toSave, resolver} = await ApplyHighlighterInstance.apply(source)

  await outputJson(DESTINATIONS.data, toSave)
  await outputJson(DESTINATIONS.highlighterResolver, resolver)
}
