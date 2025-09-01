"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";

export default function TeaserSection({
  teasers,
  hashtags,
  engagementCTA,
}: {
  teasers: string[];
  hashtags: string[];
  engagementCTA: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  // Combine all teasers, CTA, and hashtags (without headings)
  const copyAllContent = [
    ...teasers.map((t) => t),
    engagementCTA,
    hashtags.join(" "),
  ].join("\n\n");

  return (
    <div className="relative group">
      {/* Gradient border glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>

      <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
        {/* Collapsible Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full mb-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <h3 className="text-sm font-semibold text-yellow-600 uppercase tracking-wider">
              Content Preview
            </h3>
          </div>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="space-y-4">
            {/* Section Heading */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Social Media Teasers
              </h3>
              <p className="text-sm text-gray-500">
                Quick snippets to promote your blog on LinkedIn, Twitter, and more.
              </p>
            </div>

            {/* Teasers */}
            <div className="space-y-3">
              {teasers.map((teaser, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2"
                >
                  <p className="flex-1 text-gray-800 border-l-4 border-yellow-400 pl-3 italic">
                    {teaser}
                  </p>
                  <button
                    onClick={() => handleCopy(teaser)}
                    className="text-yellow-600 hover:text-yellow-800 transition"
                  >
                    <Copy size={16} />
                  </button>
                  {copied === teaser && (
                    <span className="ml-1 text-xs text-green-600">Copied!</span>
                  )}
                </div>
              ))}
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-3">
              {hashtags.map((tag, index) => (
                <div key={index} className="flex items-center">
                  <span className="px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm font-medium">
                    {tag}
                  </span>
                  <button
                    onClick={() => handleCopy(tag)}
                    className="ml-1 text-yellow-600 hover:text-yellow-800 transition"
                  >
                    <Copy size={14} />
                  </button>
                  {copied === tag && (
                    <span className="ml-1 text-xs text-green-600">Copied!</span>
                  )}
                </div>
              ))}
            </div>

            {/* Engagement CTA */}
            <div className="flex items-center mt-4 gap-2">
              <p className="flex-1 text-yellow-700 font-semibold italic">
                {engagementCTA}
              </p>
              <button
                onClick={() => handleCopy(engagementCTA)}
                className="text-yellow-600 hover:text-yellow-800 transition"
              >
                <Copy size={16} />
              </button>
              {copied === engagementCTA && (
                <span className="ml-2 text-xs text-green-600">Copied!</span>
              )}
            </div>

            {/* Copy All Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => handleCopy(copyAllContent)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg shadow hover:bg-yellow-600 transition"
              >
                <Copy size={16} />
                Copy All
              </button>
              {copied === copyAllContent && (
                <span className="ml-2 text-xs text-green-600">All Copied!</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
