const formatEntryTime = (isoString: string) => {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month}월 ${day}일 ${hours}시 ${minutes}분`;
};

const formatDuration = (minutes: number) => {
    if (minutes === 0) return "0분";
    if (minutes < 60) return `${minutes}분`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
};

const formatCurrency = (amount: number) => {
    return amount.toLocaleString("ko-KR") + "원";
};

export default {
    formatEntryTime,
    formatDuration,
    formatCurrency,
};
