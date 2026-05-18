'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, Loader2 } from 'lucide-react';

const formSchema = z.object({
  query: z.string().min(1, 'Please enter a search term'),
});

type FormValues = z.infer<typeof formSchema>;

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  const onSubmit = (data: FormValues) => {
    onSearch(data.query);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto mb-12">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
        </div>
        <input
          {...register('query')}
          type="text"
          placeholder="Search for episodes..."
          disabled={isLoading}
          className="block w-full pl-12 pr-32 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all shadow-xl backdrop-blur-md text-lg"
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center bg-green-500 hover:bg-green-400 text-black font-semibold py-2.5 px-6 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
          </button>
        </div>
      </div>
      {errors.query && <p className="mt-3 text-sm text-red-400 pl-5">{errors.query.message}</p>}
    </form>
  );
}
