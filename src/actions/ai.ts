import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';


const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe('the mood of the person who wrote the journal entry based on the journal entry'),
    subject: z.string().describe('the subject of the journal entry. This could be a short subject made from the content in the entry.'),
    negative: z.boolean().describe('is the journal entry negative? (i.e. does it contain a huge amount of negative emotions?).'),
    summary: z.string().describe('very short summary of the entire entry. ( maximmum one sentence)'),
    color: z.string().describe('a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.'),
    sentimentScore: z.number().describe('sentiment of the text and rated on a scale from 0 to 10, where 0 is extremely negative, 5 is neutral, and 10 is extremely positive.'),
  })
);

const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. This entry may contain HTML tags or rich text formatting which you should ignore and only focus on the actual content. Extract the pure text content from any formatting tags before your analysis.\n\nFollow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })

  const input = await prompt.format({ entry: content })

  console.log(input)
  return input
}
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export const analyzeGeminiAI = async (content: string) => {
  const input = await getPrompt(content)
  const model = new ChatGoogleGenerativeAI({
    temperature: 0,
    model: "gemini-1.5-flash",
    apiKey: apiKey,
  });

  const result = await model.invoke(input)

  try {
    let messageContent: string;

    if (typeof result.content === 'string') {
      messageContent = result.content;
    } else {
      throw new Error('Result content is not a string');
    }

    const jsonString = messageContent.match(/```json\n([\s\S]*?)\n```/)?.[1];

    if (!jsonString) {
      throw new Error("Failed to extract JSON from result");
    }

    const parsedData = JSON.parse(jsonString);

    return parsedData;

  } catch (e) {
    console.log(e);
  }

}
