'use client';

import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-96 h-96"
      >
        <DotLottieReact
          src="https://lottie.host/3beb7d96-ccdd-49fd-8f19-d611b12af0db/biJmKdpaKb.lottie"
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </motion.div>
    </div>
  );
}
