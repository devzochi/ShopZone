import React from 'react';
import { Lock, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const ValueProps: React.FC = () => {
  return (
    <section className="mb-14">
      <div className="bg-white border border-neutral-200/90 rounded-2xl py-6 px-6 sm:px-10 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          
          {/* Secure payments */}
          <div className="flex flex-col items-center justify-center p-2">
            <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#b93815]">
              <Lock className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="font-bold text-neutral-900 text-sm sm:text-base">
              Secure payments
            </h4>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Encrypted transactions
            </p>
          </div>

          {/* Verified products */}
          <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
            <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#b93815]">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="font-bold text-neutral-900 text-sm sm:text-base">
              Verified products
            </h4>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Quality guaranteed
            </p>
          </div>

          {/* Fast delivery */}
          <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
            <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#b93815]">
              <Truck className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="font-bold text-neutral-900 text-sm sm:text-base">
              Fast delivery
            </h4>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              2-3 business days
            </p>
          </div>

          {/* Easy returns */}
          <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
            <div className="w-10 h-10 mb-2 flex items-center justify-center text-[#b93815]">
              <RotateCcw className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="font-bold text-neutral-900 text-sm sm:text-base">
              Easy returns
            </h4>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              30-day policy
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
