import Anthropic from "@anthropic-ai/sdk";
import crypto from 'node:crypto'


type Config = {
  model: string;
  max_tokens: number,
  apiKey?: string
  temperature?: number
}

type TranslateInput = {
  text: string
  source: string
  target: string

}

export class AnthropicTranslator {
  private anthropic: Anthropic
  private config: Config

  constructor(config?: Config) {
    this.anthropic = new Anthropic({
      apiKey: config?.apiKey ?? process.env.ANTHROPIC_API_KEY
    });

    this.config = config ?? {
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      temperature: 0
    }
  }

  async translate({ text, source, target }: TranslateInput): Promise<string> {
    const msg = await this.anthropic.messages.create({
      model: this.config.model,
      max_tokens: this.config.max_tokens,
      temperature: this.config.temperature,
      system: `
You are tasked with translating an ${source} transcript to ${target} while maintaining the SRT (SubRip Subtitle) format. 
Follow these instructions carefully:
- Translate the ${source} text into ${target}, ensuring that the translation is accurate, natural-sounding, culturally appropriate and following Biblical terms.
- Translate only the text content. Do not translate or modify any metadata, timecodes, or subtitle numbers.
- Translate ${source} Biblical names into ${target} Biblical names. For example: Saul -> Sau-lơ, David -> Đa-vít. Keep the original name if you cannot find a suitable name.
- Preserve any formatting within the text, such as italics or bold, if present in the original.
- If you encounter any culturally specific terms, idioms, or references that may not have a direct equivalent in ${target}, provide the most appropriate translation that conveys the original meaning and context.
- Preserve the original ${source} words if you cannot find a suitable translation.
- Translate directly without explaination or warnings.
`,
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": `Translate this text, only return the translation, without any additional content:\n\n${text}`
            }
          ]
        }
      ]
    });

    const translation = msg.content[0].type === "text" ? msg.content[0].text : "";
    return translation
  }

  private getCacheKey(text: string, source: string, target: string) {
    return crypto.createHash('sha256').update(text + source + target, 'utf-8').digest('hex');
  }
}

