"use client"

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { journalSchema } from '@/app/lib/schema';
import { BarLoader } from 'react-spinners';
import { Input } from '@/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import { Button } from '@/components/atoms/button';
import { createJournalEntry, getDraft, getJournalEntry, saveDraft, updateJournalEntry } from '@/actions/journal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import useFetch from '@/hooks/useFetch';
import { Collection, createCollection, getCollections } from '@/actions/collection';
import CollectionForm from '@/components/molecules/CollectionForm';
import { Loader2 } from 'lucide-react';
import { analyzeGeminiAI } from '@/actions/ai';

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

export default function WritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch Hooks
  const {
    loading: collectionsLoading,
    data: collections,
    fn: fetchCollections,
  } = useFetch(getCollections);

  const {
    loading: entryLoading,
    data: existingEntry,
    fn: fetchEntry,
  } = useFetch(getJournalEntry);

  const {
    loading: draftLoading,
    data: draftData,
    fn: fetchDraft,
  } = useFetch(getDraft);

  const { loading: savingDraft, fn: saveDraftFn, data: savedDraft } = useFetch(saveDraft);

  const {
    loading: actionLoading,
    fn: actionFn,
    data: actionResult,
  } = useFetch(isEditMode ? updateJournalEntry : createJournalEntry);

  const {
    loading: createCollectionLoading,
    fn: createCollectionFn,
    data: createdCollection,
  } = useFetch(createCollection);

  const { loading: isAnalyzing, fn: analyzeFunction, data: analyzedData } = useFetch(analyzeGeminiAI)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      collectionId: "",
    },
  });

  // Handle draft or existing entry loading
  useEffect(() => {
    fetchCollections();
    if (editId) {
      setIsEditMode(true);
      fetchEntry(editId);
    } else {
      setIsEditMode(false);
      fetchDraft();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [editId]);

  // Handle setting form data from draft
  useEffect(() => {
    if (isEditMode && existingEntry) {
      reset({
        title: existingEntry.title || "",
        content: existingEntry.content || "",
        mood: existingEntry.mood || "",
        collectionId: existingEntry.collectionId || "",
      });
      
      // If editing, analyze the content with AI to get the updated mood data
      if (existingEntry.content) {
        analyzeFunction(existingEntry.content);
      }
    } else if (draftData?.success && draftData?.data) {
      reset({
        title: draftData.data.title || "",
        content: draftData.data.content || "",
        mood: draftData.data.mood || "",
        collectionId: "",
      });
      
      // If loading from draft with content, analyze it
      if (draftData.data.content) {
        analyzeFunction(draftData.data.content);
      }
    } else {
      reset({
        title: "",
        content: "",
        mood: "",
        collectionId: "",
      });
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [draftData, isEditMode, existingEntry]);

  // Handle collection creation success
  useEffect(() => {
    if (createdCollection) {
      setIsCollectionDialogOpen(false);
      fetchCollections();
      setValue("collectionId", createdCollection.id);
      toast.success(`Collection ${createdCollection.name} created!`);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [createdCollection]);

  // Handle successful submission
  useEffect(() => {
    if (actionResult && !actionLoading) {
      // Clear draft after successful publish
      if (!isEditMode) {
        saveDraftFn({ title: "", content: "", mood: "" });
      }

      router.push(
        `/collection/${actionResult.collectionId ? actionResult.collectionId : "unorganized"
        }`
      );

      toast.success(
        `Entry ${isEditMode ? "updated" : "created"} successfully!`
      );
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [actionResult, actionLoading]);

  // Add debounced content analyzer to analyze mood as user types
  useEffect(() => {
    const content = watch("content");
    
    // Only perform analysis when we have substantial content (at least 20 chars)
    // and we're not already analyzing
    if (content && content.length > 20 && !isAnalyzing) {
      const timer = setTimeout(() => {
        analyzeFunction(content);
      }, 1500); // 1.5 second delay
      
      return () => clearTimeout(timer);
    }
  }, [watch("content")]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = handleSubmit(async (data: any) => {
    // First analyze the content with AI
    const content = data.content;
    await analyzeFunction(content);
    
    if (!analyzedData) {
      toast.error("Failed to analyze entry");
      return;
    }
    
    // Map the AI analyzed mood properties to the required format
    actionFn({
      ...data,
      mood: analyzedData.mood.toLowerCase(), // Convert to lowercase to match your mood IDs
      moodScore: analyzedData.sentimentScore,
      moodQuery: analyzedData.pixabayQuery,
      ...(isEditMode && { id: editId }),
    });
    
    // Show a toast with the detected mood
    toast.success(`Entry analyzed as: ${analyzedData.emoji} ${analyzedData.mood}`);
  });

  const formData = watch();

  const handleSaveDraft = async () => {
    if (!isDirty) {
      toast.error("No changes to save");
      return;
    }

    await saveDraftFn(formData);
  };

  useEffect(() => {
    if (savedDraft?.success && !savingDraft) {
      toast.success("Draft saved successfully");
    }
  }, [savedDraft, savingDraft])

  const handleCreateCollection = async (data: Collection) => {
    createCollectionFn(data);
  };

  const isLoading =
    collectionsLoading ||
    entryLoading ||
    draftLoading ||
    actionLoading ||
    savingDraft;

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={onSubmit} className="space-y-2  mx-auto">
        <h1 className="text-5xl md:text-6xl gradient-title">
          {isEditMode ? "Edit Entry" : "What's on your mind?"}
        </h1>

        {isLoading && (
          <BarLoader className="mb-4" width={"100%"} color="orange" />
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            disabled={isLoading}
            {...register("title")}
            placeholder="Give your entry a title..."
            className={`py-5 md:text-md ${errors.title ? "border-red-500" : ""
              }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mood Analysis</label>
          <div className="p-4 border rounded-md bg-muted/30">
            <p>Your mood will be automatically analyzed by AI when you submit your entry.</p>
            {isAnalyzing && (
              <div className="flex items-center space-x-2 mt-2">
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                <span className="text-sm text-muted-foreground">Analyzing your mood...</span>
              </div>
            )}
            {analyzedData && (
              <div className="mt-2 p-3 bg-background rounded border">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{analyzedData.emoji}</span>
                  <span className="font-medium">{analyzedData.mood}</span>
                  <span className="ml-auto text-sm text-muted-foreground">Score: {analyzedData.sentimentScore}/10</span>
                </div>
              </div>
            )}
          </div>
          <input type="hidden" {...register("mood")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Write your thoughts...
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <ReactQuill
                readOnly={isLoading}
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "code-block"],
                    ["link"],
                    ["clean"],
                  ],
                }}
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Add to Collection (Optional)
          </label>
          <Controller
            name="collectionId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  if (value === "new") {
                    setIsCollectionDialogOpen(true);
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a collection..." />
                </SelectTrigger>
                <SelectContent>
                  {collections?.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    <span className="text-orange-600">
                      + Create New Collection
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-x-4 flex">
          {!isEditMode && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={savingDraft || !isDirty}
            >
              {savingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save as Draft
            </Button>
          )}
          <Button
            type="submit"
            variant="journal"
            disabled={actionLoading || !isDirty || isAnalyzing}
          >
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update" : "Publish"}
          </Button>
          {isEditMode && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.push(`/journal/${existingEntry.id}`);
              }}
              variant="destructive"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <CollectionForm
        loading={createCollectionLoading}
        onSuccess={handleCreateCollection}
        open={isCollectionDialogOpen}
        setOpen={setIsCollectionDialogOpen}
      />
    </div>
  );
}
