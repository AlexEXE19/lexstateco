import {
  Search,
  CalendarCheck,
  Key,
  HousePlus,
  UserCheck,
  BadgeDollarSign,
} from "lucide-react";

import { Variants, motion } from "framer-motion";
import { useTranslation } from "../utils/i18n";

type StepsProps = {
  type: "buyer" | "seller";
};

export default function StepsDescription({ type }: StepsProps) {
  const { t } = useTranslation();

  const buyerSteps = [
    {
      title: t("steps.buyer.1.title"),
      desc: t("steps.buyer.1.desc"),
      icon: Search,
    },
    {
      title: t("steps.buyer.2.title"),
      desc: t("steps.buyer.2.desc"),
      icon: CalendarCheck,
    },
    {
      title: t("steps.buyer.3.title"),
      desc: t("steps.buyer.3.desc"),
      icon: Key,
    },
  ];

  const sellerSteps = [
    {
      title: t("steps.seller.1.title"),
      desc: t("steps.seller.1.desc"),
      icon: HousePlus,
    },
    {
      title: t("steps.seller.2.title"),
      desc: t("steps.seller.2.desc"),
      icon: UserCheck,
    },
    {
      title: t("steps.seller.3.title"),
      desc: t("steps.seller.3.desc"),
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
            {type === "buyer"
              ? t("steps.label.buyer")
              : t("steps.label.seller")}
          </div>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            {type === "buyer"
              ? t("steps.title.buyer")
              : t("steps.title.seller")}
          </h2>
          <p className="max-w-3xl text-sm text-slate-200 sm:text-base">
            {t("steps.subtitle")}
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
                      {t("steps.step")} {index + 1}
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
                    {t("steps.hover")}
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
