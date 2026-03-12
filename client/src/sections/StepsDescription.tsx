import {
  Search,
  CalendarCheck,
  Key,
  HousePlus,
  UserCheck,
  BadgeDollarSign,
} from "lucide-react";

import { Variants, motion } from "framer-motion";

type StepsProps = {
  type: "buyer" | "seller";
};

export default function StepsDescription({ type }: StepsProps) {
  const buyerSteps = [
    {
      title: "Browse homes you love",
      desc: "Search by city, neighborhood, or price until something feels just right.",
      icon: Search,
    },
    {
      title: "Book a visit",
      desc: "Schedule a tour in seconds and see the property in person.",
      icon: CalendarCheck,
    },
    {
      title: "Get the keys",
      desc: "Finalize everything and move into your new home.",
      icon: Key,
    },
  ];

  const sellerSteps = [
    {
      title: "List your property",
      desc: "Add photos and details so buyers can discover your home.",
      icon: HousePlus,
    },
    {
      title: "Choose an agent",
      desc: "Pick a trusted agent to help manage visits and offers.",
      icon: UserCheck,
    },
    {
      title: "Get paid",
      desc: "Close the deal and receive your payment securely.",
      icon: BadgeDollarSign,
    },
  ];

  const steps = type === "buyer" ? buyerSteps : sellerSteps;

  const iconColor =
    type === "buyer" ? "bg-blue-600 text-white" : "bg-green-600 text-white";

  const borderColor =
    type === "buyer"
      ? "border-blue-200 bg-blue-50"
      : "border-green-200 bg-green-50";

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const step: Variants = {
    hidden: { y: -120, opacity: 0, scale: 0.9 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const, // <--- important
        stiffness: 180,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      className={`mt-16 w-full overflow-hidden rounded-3xl bg-gradient-to-br ${
        type === "buyer"
          ? "from-blue-900/90 via-slate-900 to-blue-800"
          : "from-emerald-900/90 via-slate-900 to-emerald-800"
      } p-[1px] shadow-2xl ring-1 ring-white/10`}
      initial="hidden"
      animate="show"
      variants={container}
    >
      <div className="h-full w-full rounded-[22px] bg-slate-950/70 px-6 py-12 backdrop-blur sm:px-10">
        <div className="flex flex-col items-center gap-4 text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em]">
            {type === "buyer" ? "For buyers" : "For sellers"}
          </div>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            {type === "buyer"
              ? "Finding your next home is smoother than you think"
              : "Selling your home can be confident and calm"}
          </h2>
          <p className="max-w-3xl text-sm text-slate-200 sm:text-base">
            Follow the streamlined steps, each with the right context and
            support. No clutter, just momentum.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((stepItem, index) => {
            const Icon = stepItem.icon;
            return (
              <motion.div
                key={index}
                variants={step}
                className="group relative overflow-hidden rounded-2xl bg-white/5 p-[1px] ring-1 ring-white/10"
              >
                <div
                  className={`absolute inset-0 ${borderColor} opacity-10 blur-3xl`}
                />
                <div className="relative flex h-full flex-col gap-4 rounded-[18px] bg-slate-950/80 p-5 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconColor} shadow-lg shadow-black/20`}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">
                      Step {index + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {stepItem.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-200">
                      {stepItem.desc}
                    </p>
                  </div>

                  <div className="mt-auto text-xs font-semibold text-slate-300 opacity-0 transition group-hover:opacity-100">
                    Stay guided, stay simple.
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
