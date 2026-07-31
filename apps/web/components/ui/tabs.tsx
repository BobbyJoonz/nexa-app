"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

export function Tabs({
  defaultValue,
  tabs
}: {
  defaultValue: string;
  tabs: { value: string; label: string; content: ReactNode }[];
}) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue}>
      <TabsPrimitive.List className="tabs-list" aria-label="Sections">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger className="tabs-trigger" value={tab.value} key={tab.value}>
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content className="tabs-content" value={tab.value} key={tab.value}>
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
