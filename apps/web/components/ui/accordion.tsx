"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export function Accordion({
  items
}: {
  items: { id: string; title: string; content: ReactNode }[];
}) {
  return (
    <AccordionPrimitive.Root className="accordion" type="multiple">
      {items.map((item) => (
        <AccordionPrimitive.Item className="accordion-item" value={item.id} key={item.id}>
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="accordion-trigger">
              <span>{item.title}</span>
              <ChevronDown aria-hidden size={18} />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="accordion-content">
            <div>{item.content}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
