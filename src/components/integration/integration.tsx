"use client";

import Image from "next/image";
import Link from "next/link";

const integrations = [
  {
    name: "WordPress",
    icon: "/icons/wordpress.svg",
    description: "Publish directly to your blog",
    link: "/integration/wordpress",
  },
  {
    name: "Medium",
    icon: "/icons/medium.svg",
    description: "Copy & paste formatted HTML",
  },
];

export default function IntegrationGrid() {
  return (
    <section className="py-24" id="integrations">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Seamless Publishing
        </h2>
        <p className="mt-2 text-gray-600 text-base sm:text-lg">
          Go live in seconds with direct WordPress publishing or ready-to-paste Medium formatting.
        </p>
      </div>

      <div className="max-w-md mx-auto grid grid-cols-2 gap-8 px-6">
        {integrations.map((integration, i) =>
          integration.link ? (
            <Link
              key={i}
              href={integration.link}
              className="flex flex-col items-center text-center space-y-3 group cursor-pointer"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-full transition-transform group-hover:scale-110">
                <Image
                  src={integration.icon}
                  alt={integration.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <p className="text-sm font-medium text-gray-800">{integration.name}</p>
              <p className="text-xs text-gray-500">{integration.description}</p>
            </Link>
          ) : (
            <div
              key={i}
              className="flex flex-col items-center text-center space-y-3 group"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-full transition-transform group-hover:scale-110">
                <Image
                  src={integration.icon}
                  alt={integration.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <p className="text-sm font-medium text-gray-800">{integration.name}</p>
              <p className="text-xs text-gray-500">{integration.description}</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
