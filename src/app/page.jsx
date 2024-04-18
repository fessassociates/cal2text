"use client";
import React from "react";

function MainComponent() {
  const [selectedDates, setSelectedDates] = React.useState([]);
  const [currentWeekStart, setCurrentWeekStart] = React.useState(
    getMonday(new Date())
  );

  function getMonday(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  function formatDate(date) {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  function formatTime(date) {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  function formatDateTime(date) {
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${date.getMonth() + 1}月${date.getDate()}日（${
      days[date.getDay()]
    }）${formatTime(date)}`;
  }

  function isSelected(date) {
    return selectedDates.some((d) => d.getTime() === date.getTime());
  }

  function handleDateClick(date) {
    if (isSelected(date)) {
      setSelectedDates(
        selectedDates.filter((d) => d.getTime() !== date.getTime())
      );
    } else {
      setSelectedDates([...selectedDates, date].sort((a, b) => a - b));
    }
  }

  function handlePrevWeek() {
    setCurrentWeekStart(
      new Date(
        currentWeekStart.getFullYear(),
        currentWeekStart.getMonth(),
        currentWeekStart.getDate() - 7
      )
    );
  }

  function handleNextWeek() {
    setCurrentWeekStart(
      new Date(
        currentWeekStart.getFullYear(),
        currentWeekStart.getMonth(),
        currentWeekStart.getDate() + 7
      )
    );
  }

  function handleCopy() {
    const introText = "下記の日時でご都合いかがでしょうか。\n";
    const datesText = selectedDates.map(formatDateTime).join("\n");
    const fullText = introText + datesText;
    navigator.clipboard.writeText(fullText);
  }

  function handleReset() {
    setSelectedDates([]);
  }

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return date;
  });

  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setHours(6 + Math.floor(i / 2), (i % 2) * 30);
    return date;
  });

  return (
    <div className="w-[1024px] mx-auto">
      <h1 className="text-center text-4xl font-titan-one">cal2text</h1>
      <div className="flex mt-8">
        <div className="w-[800px]">
          <div className="flex justify-between mb-2">
            <button onClick={handlePrevWeek} className="text-2xl">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button onClick={handleNextWeek} className="text-2xl">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-[100px]"></th>
                {weekDates.map((date) => (
                  <th
                    key={date.getTime()}
                    className="border border-gray-300 py-2 px-4"
                  >
                    <div className="text-lg">{formatDate(date)}</div>
                    <div className="text-sm">
                      (
                      {
                        ["月", "火", "水", "木", "金", "土", "日"][
                          date.getDay()
                        ]
                      }
                      )
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot.getTime()}>
                  {slot.getMinutes() === 0 && (
                    <td
                      className="border border-gray-300 text-sm text-center h-[40px]"
                      rowSpan="2"
                    >
                      {formatTime(slot)}
                    </td>
                  )}
                  {weekDates.map((date) => {
                    const dateTime = new Date(date);
                    dateTime.setHours(slot.getHours(), slot.getMinutes());
                    const selected = isSelected(dateTime);
                    return (
                      <td
                        key={dateTime.getTime()}
                        className={`border border-gray-300 w-[100px] h-[20px] text-center text-xs cursor-pointer ${
                          selected ? "bg-gray-200" : ""
                        }`}
                        onClick={() => handleDateClick(dateTime)}
                      >
                        {selected && formatTime(dateTime)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ml-8">
          <div className="whitespace-nowrap mb-4">
            下記の日時でご都合いかがでしょうか。
          </div>
          {selectedDates.map((date) => (
            <div key={date.getTime()} className="whitespace-nowrap">
              {formatDateTime(date)}
            </div>
          ))}
          <button
            onClick={handleCopy}
            className="bg-blue-500 text-white px-4 py-2 mt-4 mr-4"
          >
            コピー
          </button>
          <button
            onClick={handleReset}
            className="border border-gray-300 px-4 py-2 mt-4"
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;