"use client"
export const Select = ({ options, onSelect }: {
    onSelect: (value: string) => void;
    options: {
        key: string;
        value: string;
    }[];
}) => {
    return (
        <div className="relative">
            <select 
                onChange={(e) => onSelect(e.target.value)} 
                className="w-full appearance-none bg-[#f5f5f7] hover:bg-[#ebebed] focus:bg-white border border-transparent focus:border-black/10 focus:ring-4 focus:ring-black/5 text-[#1d1d1f] text-sm font-medium rounded-2xl px-4 py-3 pr-10 outline-none transition-all cursor-pointer"
            >
                {options.map(option => <option key={option.key} value={option.key}>{option.value}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#86868b]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </div>
        </div>
    );
}