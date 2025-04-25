"use client";

import { useState } from "react";
import { Loader2, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/atoms/dialog";
import { answerJournalQuestion } from "@/actions/ai";

interface JournalInsightsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  analyticsData: any;
  initialQuestion?: string;
}

const JournalInsightsDialog = ({ 
  open, 
  setOpen, 
  analyticsData, 
  initialQuestion = "" 
}: JournalInsightsDialogProps) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);

  const handleAskQuestion = async () => {
    if (!question.trim() || !analyticsData) return;
    
    setIsAsking(true);
    setAnswer("");
    
    try {
      const result = await answerJournalQuestion(question, analyticsData);
      if (result.error) {
        setAnswer(result.error);
      } else {
        setAnswer(result.answer);
        
        // Save this question to history if it's not already there
        if (!previousQuestions.includes(question)) {
          setPreviousQuestions(prev => [question, ...prev.slice(0, 4)]); // Keep last 5 questions
        }
      }
    } catch (error) {
      setAnswer("Sorry, there was an error processing your question.");
      console.error(error);
    } finally {
      setIsAsking(false);
    }
  };

  const handleQuestionSelect = (selectedQuestion: string) => {
    setQuestion(selectedQuestion);
    // Don't automatically ask to avoid unexpected API calls
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Journal Insights</DialogTitle>
          <DialogDescription>
            Ask questions about your journal entries and get AI-powered insights
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {/* Question input */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="How was my mood last week?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
              prefixIcon={<Search className="h-4 w-4 text-gray-400" />}
            />
            <Button 
              onClick={handleAskQuestion} 
              disabled={isAsking || !question.trim()}
              className="whitespace-nowrap"
            >
              {isAsking && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Ask
            </Button>
          </div>

          {/* Previous questions */}
          {previousQuestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <div className="w-full text-xs text-muted-foreground">Recent questions:</div>
              {previousQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuestionSelect(q)}
                  className="text-xs"
                >
                  {q.length > 30 ? q.substring(0, 27) + "..." : q}
                </Button>
              ))}
            </div>
          )}

          {/* Answer */}
          <div className="min-h-[200px] max-h-[400px] overflow-auto rounded-md border p-4">
            {isAsking ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <p className="text-muted-foreground">Analyzing your journals...</p>
              </div>
            ) : answer ? (
              <div className="prose prose-sm max-w-none">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                  <div className="whitespace-pre-wrap">{answer}</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <p>Ask a question about your journal entries</p>
                <p className="text-xs mt-2">For example: &quot;How was my mood last week?&quot; or &quot;What did I write about yesterday?&quot;</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JournalInsightsDialog;