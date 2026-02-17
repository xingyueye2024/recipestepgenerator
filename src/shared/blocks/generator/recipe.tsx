'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  CreditCard,
  Download,
  ImageIcon,
  Loader2,
  Sparkles,
  User,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';
import { AIMediaType, AITaskStatus } from '@/extensions/ai/types';
import {
  ImageUploader,
  ImageUploaderValue,
  LazyImage,
} from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Progress } from '@/shared/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useAppContext } from '@/shared/contexts/app';
import { cn } from '@/shared/lib/utils';

interface RecipeStepGeneratorProps {
  maxSizeMB?: number;
  className?: string;
}

interface GeneratedImage {
  id: string;
  url: string;
  provider?: string;
  model?: string;
  prompt?: string;
}

interface BackendTask {
  id: string;
  status: string;
  provider: string;
  model: string;
  prompt: string | null;
  taskInfo: string | null;
  taskResult: string | null;
}

const POLL_INTERVAL = 5000;
const GENERATION_TIMEOUT = 180000;

const STYLE_OPTIONS = [
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'illustrated', label: 'Illustrated' },
];

const ASPECT_RATIO_OPTIONS = [
  { value: '9:16', label: '9:16', description: 'Mobile Vertical' },
  { value: '16:9', label: '16:9', description: 'Desktop Landscape' },
  { value: '1:1', label: '1:1', description: 'Square' },
];

const PROVIDER = 'gemini';
const MODEL = 'gemini-3-pro-image-preview';

function parseTaskResult(taskResult: string | null): any {
  if (!taskResult) return null;
  try {
    return JSON.parse(taskResult);
  } catch {
    return null;
  }
}

function extractImageUrls(result: any): string[] {
  if (!result) return [];
  const output = result.output ?? result.images ?? result.data;
  if (!output) return [];
  if (typeof output === 'string') return [output];
  if (Array.isArray(output)) {
    return output
      .flatMap((item) => {
        if (!item) return [];
        if (typeof item === 'string') return [item];
        if (typeof item === 'object') {
          const candidate =
            item.url ?? item.uri ?? item.image ?? item.src ?? item.imageUrl;
          return typeof candidate === 'string' ? [candidate] : [];
        }
        return [];
      })
      .filter(Boolean);
  }
  if (typeof output === 'object') {
    const candidate =
      output.url ?? output.uri ?? output.image ?? output.src ?? output.imageUrl;
    if (typeof candidate === 'string') return [candidate];
  }
  return [];
}

export function RecipeStepGenerator({
  maxSizeMB = 5,
  className,
}: RecipeStepGeneratorProps) {
  const t = useTranslations('ai.recipe.generator');

  const [stepCount, setStepCount] = useState(4);
  const [style, setStyle] = useState('professional');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [costCredits, setCostCredits] = useState(4);

  const [referenceImageItems, setReferenceImageItems] = useState<
    ImageUploaderValue[]
  >([]);
  const [referenceImageUrls, setReferenceImageUrls] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(
    null
  );
  const [taskStatus, setTaskStatus] = useState<AITaskStatus | null>(null);
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);

  const { user, isCheckSign, setIsShowSignModal, fetchUserCredits } =
    useAppContext();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setCostCredits(stepCount);
  }, [stepCount]);

  const remainingCredits = user?.credits?.remainingCredits ?? 0;

  const handleReferenceImagesChange = useCallback(
    (items: ImageUploaderValue[]) => {
      setReferenceImageItems(items);
      const uploadedUrls = items
        .filter((item) => item.status === 'uploaded' && item.url)
        .map((item) => item.url as string);
      setReferenceImageUrls(uploadedUrls);
    },
    []
  );

  const isReferenceUploading = useMemo(
    () => referenceImageItems.some((item) => item.status === 'uploading'),
    [referenceImageItems]
  );

  const hasReferenceUploadError = useMemo(
    () => referenceImageItems.some((item) => item.status === 'error'),
    [referenceImageItems]
  );

  const resetTaskState = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setTaskId(null);
    setGenerationStartTime(null);
    setTaskStatus(null);
  }, []);

  const taskStatusLabel = useMemo(() => {
    if (!taskStatus) return '';
    switch (taskStatus) {
      case AITaskStatus.PENDING:
        return t('status_pending');
      case AITaskStatus.PROCESSING:
        return t('status_processing');
      case AITaskStatus.SUCCESS:
        return t('status_success');
      case AITaskStatus.FAILED:
        return t('status_failed');
      default:
        return '';
    }
  }, [taskStatus, t]);

  const pollTaskStatus = useCallback(
    async (id: string) => {
      try {
        if (
          generationStartTime &&
          Date.now() - generationStartTime > GENERATION_TIMEOUT
        ) {
          resetTaskState();
          toast.error(t('timeout_error'));
          return true;
        }

        const resp = await fetch('/api/ai/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId: id }),
        });

        if (!resp.ok) {
          throw new Error(`request failed with status: ${resp.status}`);
        }

        const { code, message, data } = await resp.json();
        if (code !== 0) {
          throw new Error(message || 'Query task failed');
        }

        const task = data as BackendTask;
        const currentStatus = task.status as AITaskStatus;
        setTaskStatus(currentStatus);

        const parsedResult = parseTaskResult(task.taskInfo);
        const imageUrls = extractImageUrls(parsedResult);

        if (currentStatus === AITaskStatus.PENDING) {
          setProgress((prev) => Math.max(prev, 20));
          return false;
        }

        if (currentStatus === AITaskStatus.PROCESSING) {
          if (imageUrls.length > 0) {
            setGeneratedImages(
              imageUrls.map((url, index) => ({
                id: `${task.id}-${index}`,
                url,
                provider: task.provider,
                model: task.model,
                prompt: task.prompt ?? undefined,
              }))
            );
            setProgress((prev) => Math.max(prev, 85));
          } else {
            setProgress((prev) => Math.min(prev + 10, 80));
          }
          return false;
        }

        if (currentStatus === AITaskStatus.SUCCESS) {
          if (imageUrls.length === 0) {
            toast.error(t('no_images_error'));
          } else {
            setGeneratedImages(
              imageUrls.map((url, index) => ({
                id: `${task.id}-${index}`,
                url,
                provider: task.provider,
                model: task.model,
                prompt: task.prompt ?? undefined,
              }))
            );
            toast.success(t('generation_success'));
          }
          setProgress(100);
          resetTaskState();
          return true;
        }

        if (currentStatus === AITaskStatus.FAILED) {
          const errorMessage =
            parsedResult?.errorMessage || t('generation_failed');
          toast.error(errorMessage);
          resetTaskState();
          fetchUserCredits();
          return true;
        }

        setProgress((prev) => Math.min(prev + 5, 95));
        return false;
      } catch (error: any) {
        console.error('Error polling recipe task:', error);
        toast.error(`${t('query_failed')}: ${error.message}`);
        resetTaskState();
        fetchUserCredits();
        return true;
      }
    },
    [generationStartTime, resetTaskState, fetchUserCredits, t]
  );

  useEffect(() => {
    if (!taskId || !isGenerating) return;

    let cancelled = false;

    const tick = async () => {
      if (!taskId) return;
      const completed = await pollTaskStatus(taskId);
      if (completed) cancelled = true;
    };

    tick();

    const interval = setInterval(async () => {
      if (cancelled || !taskId) {
        clearInterval(interval);
        return;
      }
      const completed = await pollTaskStatus(taskId);
      if (completed) clearInterval(interval);
    }, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [taskId, isGenerating, pollTaskStatus]);

  const buildPrompt = () => {
    return `Analyze this food photo and generate ${stepCount} step-by-step cooking instruction images showing the complete cooking process from preparation to the final dish. Style: ${style}. Aspect ratio: ${aspectRatio}. Show realistic cooking progression with proper technique sequences, ingredient transformations, and realistic cooking times.`;
  };

  const handleGenerate = async () => {
    if (!user) {
      setIsShowSignModal(true);
      return;
    }

    if (remainingCredits < costCredits) {
      toast.error(t('insufficient_credits'));
      return;
    }

    if (referenceImageUrls.length === 0) {
      toast.error(t('upload_required'));
      return;
    }

    setIsGenerating(true);
    setProgress(15);
    setTaskStatus(AITaskStatus.PENDING);
    setGeneratedImages([]);
    setGenerationStartTime(Date.now());

    try {
      const prompt = buildPrompt();
      const options: any = {
        image_input: referenceImageUrls,
      };

      const resp = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: AIMediaType.IMAGE,
          scene: 'image-to-image',
          provider: PROVIDER,
          model: MODEL,
          prompt,
          options,
        }),
      });

      if (!resp.ok) {
        throw new Error(`request failed with status: ${resp.status}`);
      }

      const { code, message, data } = await resp.json();
      if (code !== 0) {
        throw new Error(message || 'Failed to create recipe task');
      }

      const newTaskId = data?.id;
      if (!newTaskId) {
        throw new Error('Task id missing in response');
      }

      if (data.status === AITaskStatus.SUCCESS && data.taskInfo) {
        const parsedResult = parseTaskResult(data.taskInfo);
        const imageUrls = extractImageUrls(parsedResult);
        if (imageUrls.length > 0) {
          setGeneratedImages(
            imageUrls.map((url, index) => ({
              id: `${newTaskId}-${index}`,
              url,
              provider: PROVIDER,
              model: MODEL,
              prompt,
            }))
          );
          toast.success(t('generation_success'));
          setProgress(100);
          resetTaskState();
          await fetchUserCredits();
          return;
        }
      }

      setTaskId(newTaskId);
      setProgress(25);
      await fetchUserCredits();
    } catch (error: any) {
      console.error('Failed to generate recipe steps:', error);
      toast.error(`${t('generation_failed')}: ${error.message}`);
      resetTaskState();
    }
  };

  const handleDownloadImage = async (image: GeneratedImage) => {
    if (!image.url) return;
    try {
      setDownloadingImageId(image.id);
      const resp = await fetch(
        `/api/proxy/file?url=${encodeURIComponent(image.url)}`
      );
      if (!resp.ok) throw new Error('Failed to fetch image');
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `recipe-step-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 200);
      toast.success(t('download_success'));
    } catch {
      toast.error(t('download_failed'));
    } finally {
      setDownloadingImageId(null);
    }
  };

  const handleDownloadAll = async () => {
    for (const image of generatedImages) {
      await handleDownloadImage(image);
    }
  };

  return (
    <section id="generator" className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('title')}
            </h2>
            <p className="text-muted-foreground mt-2">{t('description')}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* Left panel: Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  {t('upload_title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                {/* Upload zone */}
                <div className="space-y-4">
                  <ImageUploader
                    title={t('upload_label')}
                    allowMultiple={false}
                    maxImages={1}
                    maxSizeMB={maxSizeMB}
                    onChange={handleReferenceImagesChange}
                    emptyHint={t('upload_hint')}
                  />
                  {hasReferenceUploadError && (
                    <p className="text-destructive text-xs">
                      {t('upload_error')}
                    </p>
                  )}
                </div>

                {/* Step count */}
                <div className="space-y-2">
                  <Label>{t('step_count')}</Label>
                  <div className="flex gap-2">
                    {[4, 5, 6, 7, 8].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setStepCount(n)}
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors',
                          stepCount === n
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        {n}
                      </button>
                    ))}
                    <span className="text-muted-foreground flex items-center pl-1 text-sm">
                      {t('steps')}
                    </span>
                  </div>
                </div>

                {/* Style selector */}
                <div className="space-y-2">
                  <Label>{t('style')}</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(`styles.${option.value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Aspect ratio */}
                <div className="space-y-2">
                  <Label>{t('aspect_ratio')}</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASPECT_RATIO_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} - {t(`ratios.${option.value.replace(':', '_')}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced settings toggle */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between text-sm transition-colors"
                >
                  <span>{t('advanced_settings')}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      showAdvanced && 'rotate-180'
                    )}
                  />
                </button>

                {showAdvanced && (
                  <div className="space-y-4 rounded-lg border p-4">
                    <p className="text-muted-foreground text-xs">
                      {t('advanced_hint')}
                    </p>
                  </div>
                )}

                {/* Generate button */}
                {!isMounted ? (
                  <Button className="w-full" disabled size="lg">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('loading')}
                  </Button>
                ) : isCheckSign ? (
                  <Button className="w-full" disabled size="lg">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('checking_account')}
                  </Button>
                ) : user ? (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleGenerate}
                    disabled={
                      isGenerating ||
                      referenceImageUrls.length === 0 ||
                      isReferenceUploading ||
                      hasReferenceUploadError
                    }
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('generating')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {t('generate')}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setIsShowSignModal(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {t('sign_in_to_generate')}
                  </Button>
                )}

                {/* Credits info */}
                {!isMounted ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary">
                      {t('credits_cost', { credits: costCredits })}
                    </span>
                    <span>{t('credits_remaining', { credits: 0 })}</span>
                  </div>
                ) : user && remainingCredits > 0 ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary">
                      {t('credits_cost', { credits: costCredits })}
                    </span>
                    <span>
                      {t('credits_remaining', { credits: remainingCredits })}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary">
                        {t('credits_cost', { credits: costCredits })}
                      </span>
                      <span>
                        {t('credits_remaining', { credits: remainingCredits })}
                      </span>
                    </div>
                    <Link href="/pricing">
                      <Button variant="outline" className="w-full" size="lg">
                        <CreditCard className="mr-2 h-4 w-4" />
                        {t('buy_credits')}
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Progress */}
                {isGenerating && (
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t('progress')}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                    {taskStatusLabel && (
                      <p className="text-muted-foreground text-center text-xs">
                        {taskStatusLabel}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right panel: Results */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    <ImageIcon className="h-5 w-5" />
                    {t('results_title')}
                  </CardTitle>
                  {generatedImages.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadAll}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      {t('download_all')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-8">
                {generatedImages.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {generatedImages.map((image, index) => (
                      <div key={image.id} className="space-y-2">
                        <div className="relative overflow-hidden rounded-lg border">
                          <div className="bg-primary/10 absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-xs font-medium">
                            {t('step_label', { step: index + 1 })}
                          </div>
                          <LazyImage
                            src={image.url}
                            alt={`${t('step_label', { step: index + 1 })}`}
                            className="h-auto w-full"
                          />
                          <div className="absolute right-2 bottom-2 flex justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadImage(image)}
                              disabled={downloadingImageId === image.id}
                            >
                              {downloadingImageId === image.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <ImageIcon className="text-muted-foreground h-10 w-10" />
                    </div>
                    <p className="text-muted-foreground">
                      {isGenerating
                        ? t('generating_hint')
                        : t('no_results')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
