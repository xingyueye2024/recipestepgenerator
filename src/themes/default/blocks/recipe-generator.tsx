'use client';

import { RecipeStepGenerator } from '@/shared/blocks/generator/recipe';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function RecipeGenerator({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <RecipeStepGenerator className={cn(section.className, className)} />
  );
}
