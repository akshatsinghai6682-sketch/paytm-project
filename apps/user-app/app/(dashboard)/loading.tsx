export default function Loading() {
    return <div className="w-full animate-pulse">
        <div className="h-8 w-56 bg-slate-200 rounded-lg mt-8 mb-6" />
        <div className="h-36 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-3 gap-5 mt-8">
            <div className="h-24 bg-slate-200 rounded-xl" />
            <div className="h-24 bg-slate-200 rounded-xl" />
            <div className="h-24 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl mt-8" />
    </div>
}