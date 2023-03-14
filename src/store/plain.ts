export function setOpenAIApiKey(key: string) {
  return { type: 'set-openai-api-key' as const, key };
}
