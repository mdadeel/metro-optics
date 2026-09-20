import { Truck, ShieldCheck, RotateCcw, Award } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Express Shipping',
    desc: 'Complimentary insured courier delivery on all orders exceeding $99.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: ShieldCheck,
    title: 'Digital Prescription Guarantee',
    desc: 'Each custom lens undergoes optical laser verification before dispatch.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: RotateCcw,
    title: '30-Day Hassle-Free Returns',
    desc: 'Not 100% satisfied? Return or exchange with prepaid return labels.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Award,
    title: 'Licensed In-House Opticians',
    desc: 'Connect with certified NY opticians for frame fitting & prescription advice.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Why Choose Metro Optics
          </h3>
          <p className="text-xs text-gray-500">Industry-leading standards in clinical optics and customer satisfaction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={i}
              className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-3"
            >
              <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center ${feat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                {feat.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
