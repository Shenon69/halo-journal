import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe('A mood label that describes the overall emotion of the person who wrote the journal entry.'),
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

export const answerJournalQuestion = async (question: string, entriesData: any) => {
  try {
    if (!question.trim()) {
      return { answer: "Please ask a question about your journal entries." };
    }

    // Format entries data for the AI to process and ensure newest entries are first
    const formattedEntries = entriesData.entries
      .map((entry: any) => ({
        id: entry.id,
        date: new Date(entry.createdAt).toLocaleDateString(),
        title: entry.title,
        content: entry.content.replace(/<[^>]*>/g, ''), // Strip HTML tags
        mood: entry.mood,
        moodScore: entry.moodScore,
        createdAt: new Date(entry.createdAt) // Keep the date object for sorting
      }))
      // Sort entries by date, newest first
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
      // Remove the createdAt after sorting
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ createdAt, ...rest }) => rest);

    // Current date for reference in the prompt
    const currentDate = new Date().toLocaleDateString();

    const prompt = `
You are an AI assistant analyzing a user's journal entries. Answer the following question based on the journal entries data provided.
Be empathetic, insightful, and specific in your response. Reference specific entries when relevant. Make the response short and sweet.

VERY IMPORTANT: When you reference a specific journal entry, you MUST include the entry ID using this exact format: [entryID:entry-id-here]
For example, if referring to an entry with ID "abc-123", write something like: "In your entry from March 15 [entryID:abc-123], you mentioned feeling happy..."

Today's date is ${currentDate}. The entries are sorted with the most recent first.

Here is the question: "${question}"

Here are the journal entries (most recent first):
${JSON.stringify(formattedEntries, null, 2)}
    `;

    const model = new ChatGoogleGenerativeAI({
      temperature: 0.3, // Slightly higher temperature for more creative responses
      model: "gemini-1.5-flash",
      apiKey: apiKey,
    });

    const result = await model.invoke(prompt);
    
    let messageContent: string;
    if (typeof result.content === 'string') {
      messageContent = result.content;
    } else {
      throw new Error('Result content is not a string');
    }

    return { answer: messageContent };
  } catch (e) {
    console.error("Error answering journal question:", e);
    return { error: "Sorry, I couldn't answer your question at the moment." };
  }
}
