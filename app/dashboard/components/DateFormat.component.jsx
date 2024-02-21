'use client';

const DateFormat = ({ date }) => {
    return date ? new Date(date).toLocaleString("vi-VN", { timezone: "Asia/Ho_Chi_Minh" }) : "None"
}

export default DateFormat