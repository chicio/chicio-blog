import { Technology } from "@/types/home/technology";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { FC } from "react";

const cardVariants: Variants = {
  hidden: { scale: 0.8 },
  visible: {
    scale: 1,
    transition: { duration: 0.4, type: "tween", ease: "linear" },
  },
};

export const TechnologyCard: FC<{ tech: Technology; index: number }> = ({
  tech,
  index,
}) => {
  return (
    <motion.div
      className="glow-container max-width-[150px] flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-between p-5 sm:max-w-[250px]"
      key={tech.name}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Image
        className="object-contain mb-3"
        src={tech.image}
        alt={tech.name}
        placeholder="blur"
        width={60}
        height={60}
      />
      <span className="text-primary-text text-base font-medium">{tech.name}</span>
      <span className="text-secondary text-sm mt-2">{tech.years}</span>
    </motion.div>
  );
};
