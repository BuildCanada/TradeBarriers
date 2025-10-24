"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown, ChevronRight, Link } from "lucide-react";

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is the Trade Barriers Tracker?",
    answer:
      "This dashboard tracks agreements amongst Canadian provinces and territories that reduce or eliminate barriers to trade and labour mobility.\n\nIt shows commitments that have been made, the scope of each agreement, which governments are participating, and the current status of implementation.",
  },
  {
    question: "What is an interprovincial trade barrier?",
    answer:
      "Internal trade barriers should not be thought of as light switches (i.e. either trade is permitted or it is not). Rather, they are costs incurred on account of transacting across internal borders.\n\nExamples include: varying driver qualifications for long-combination vehicles, inconsistent definition of sunrise and sunset for trucking restrictions, divergent technical safety rules, duplicative end-of-life reporting requirements for producers of electronics.",
  },
  {
    question: "What do the statuses mean?",
    answer:
      "- Awaiting Sponsorship: These are known barriers that have not been added as an item to an agenda\n- Under Negotiation: Jurisdictions are negotiating the item, but an agreement has not yet been reached\n- Agreement Reached: The jurisdictions have reached an agreement to address the item\n- Partially Implemented: At least one jurisdiction has implemented the agreement\n- Implemented: All jurisdictions have fully implemented the agreement\n- Deferred: Jurisdictions have deferred addressing the item",
  },
  {
    question: "Why does this matter?",
    answer:
      "Canada's internal trade barriers are estimated to cost over <a href='https://www.bnnbloomberg.ca/business/economics/2025/02/04/interprovincial-trade-barriers-what-they-are-why-they-exist-and-how-to-cut-them/' target='_blank' rel='noopener noreferrer' class='text-bloomberg-blue hover:underline'>$200 billion</a> each year (equivalent to 7.9% of Canada's GDP) by limiting the free movement of goods, services, and people across provincial borders.\n\nTracking agreements helps citizens, businesses, and policymakers see where progress is being made—and where more work is needed.",
  },
  {
    question: "Where does the data come from?",
    answer:
      "We aggregate across reports and press releases of individual governments and agencies, the Council of the Federation, the Committee on Internal Trade, and the Canadian Free Trade Agreement's (i) Internal Trade Secretariat and (ii) Regulatory Reconciliation and Cooperation Table, and more.",
  },
  {
    question: "How often is the Tracker updated?",
    answer:
      "Updates are published as new agreements are announced or progress is verified.",
  },
  {
    question: "Is this an official government site?",
    answer:
      "No. Build Canada is a non-partisan civic initiative. The Tracker compiles publicly available information to increase transparency.",
  },
  {
    question: "What should I do if I notice something wrong or incomplete?",
    answer:
      "We make our best efforts to be accurate, but may not get everything right! We'd love your help with improvements or corrections. Email us at <a href='mailto:hi@buildcanada.com' class='text-bloomberg-blue hover:underline'>hi@buildcanada.com</a>.",
  },
];

export default function FAQModal({ isOpen, onClose }: FAQModalProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-mono font-semibold uppercase tracking-wide text-foreground">
            Frequently Asked Questions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="border border-border rounded-md">
              <button
                onClick={() => toggleExpanded(index)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted transition-colors"
              >
                <span className="font-mono font-medium text-foreground text-sm">
                  {item.question}
                </span>
                {expandedItems.has(index) ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {expandedItems.has(index) && (
                <div className="px-4 pb-3">
                  <div
                    className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider text-center">
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/ryan-manucha-a914a7a1/"
              className="text-bloomberg-blue hover:underline"
            >
              Ryan
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/0xsnafu"
              className="text-bloomberg-blue hover:underline"
            >
              Marty
            </a>{" "}
            🏗️🇨🇦 A{" "}
            <Link href="/" className="text-bloomberg-blue hover:underline">
              Build Canada
            </Link>{" "}
            Project
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
