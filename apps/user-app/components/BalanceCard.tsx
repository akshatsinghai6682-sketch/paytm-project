export const BalanceCard = ({ amount, locked }: {
    amount: number;
    locked: number;
}) => {
    const rupees = (paise: number) => (paise / 100).toLocaleString("en-IN");

    return <div className="rounded-2xl p-6 text-white bg-gradient-to-r from-[#002970] to-[#00baf2] shadow-lg">
        <div className="text-sm opacity-80">Wallet balance</div>
        <div className="text-4xl font-bold mt-1">₹ {rupees(amount + locked)}</div>
        <div className="flex gap-8 mt-5 text-sm">
            <div>
                <div className="opacity-70">Available</div>
                <div className="font-semibold">₹ {rupees(amount)}</div>
            </div>
            {locked > 0 && <div>
                <div className="opacity-70">On hold</div>
                <div className="font-semibold">₹ {rupees(locked)}</div>
            </div>}
        </div>
    </div>
}