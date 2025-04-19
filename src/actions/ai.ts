import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';


const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe('A mood label that describes the overall emotion of the journal entry, like "Happy", "Sad", "Anxious".'),
    emoji: z.string().describe('A single emoji that best represents the mood. Example: "😊" for Happy, "😢" for Sad.'),
    sentimentScore: z.number().describe('A sentiment score rated from 0 to 10. 0 means extremely negative, 5 is neutral, 10 is extremely positive.'),
    pixabayQuery: z.string().describe('A string of keywords separated by "+" signs suitable for searching Pixabay for an image that matches the mood. Example: "happy+smile+sunshine".'),
    color: z.string().describe('A HEX color code representing the mood visually. Example: "#facc15" for yellow representing joy.'),
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
