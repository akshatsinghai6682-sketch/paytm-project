"use client"

export const TextInput = ({
    placeholder,
    onChange,
    label,
    value
}: {
    placeholder: string;
    onChange: (value: string) => void;
    label?: string;
    value?: string;
}) => {
    return <div className="pt-2">
        {label && <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#86868b]">{label}</label>}
        <input 
            value={value}
            onChange={(e) => onChange(e.target.value)} 
            type="text" 
            className="w-full bg-[#f5f5f7] hover:bg-[#ebebed] focus:bg-white border border-transparent focus:border-black/10 focus:ring-4 focus:ring-black/5 text-[#1d1d1f] text-sm font-medium rounded-2xl px-4 py-3 outline-none transition-all placeholder:text-[#86868b]" 
            placeholder={placeholder} 
        />
    </div>
}