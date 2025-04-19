'use client';

import { motion } from 'framer-motion';

interface RecipeBatchDividerProps {
  batchNumber: number;
}

export default function RecipeBatchDivider({ batchNumber }: RecipeBatchDividerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full my-4 flex items-center"
    >
      <div className="flex-grow h-px bg-gray-200"></div>
      <div className="px-4 text-sm text-gray-500 font-medium">
        Batch {batchNumber}
      </div>
      <div className="flex-grow h-px bg-gray-200"></div>
    </motion.div>
  );
}
